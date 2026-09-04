package com.board.post;

import com.board.common.ErrorCode;
import com.board.exception.BusinessException;
import com.board.post.dto.*;
import com.board.user.User;
import com.board.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@Transactional(readOnly = true)
public class PostService {

    private static final Set<String> SEARCH_TYPES = Set.of("title", "content", "author", "all");

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public PageResponse<PostSummaryResponse> getPosts(int page, int size, String searchType, String keyword) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), size, Sort.by(Sort.Direction.DESC, "id"));

        Page<Post> result;
        if (keyword == null || keyword.isBlank()) {
            result = postRepository.findAll(pageable);
        } else {
            String type = (searchType == null || !SEARCH_TYPES.contains(searchType)) ? "all" : searchType;
            result = postRepository.search(type, keyword.trim(), pageable);
        }
        return PageResponse.of(result, PostSummaryResponse::from);
    }

    @Transactional
    public PostResponse getPost(Long id, Long currentUserId) {
        Post post = findPostOrThrow(id);
        post.increaseViewCount();
        return PostResponse.of(post, currentUserId);
    }

    @Transactional
    public PostResponse create(PostCreateRequest request, Long authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        Post saved = postRepository.save(new Post(request.getTitle(), request.getContent(), author));
        return PostResponse.of(saved, authorId);
    }

    @Transactional
    public PostResponse update(Long id, PostUpdateRequest request, Long currentUserId) {
        Post post = findPostOrThrow(id);
        requireAuthor(post, currentUserId);
        post.update(request.getTitle(), request.getContent());
        return PostResponse.of(post, currentUserId);
    }

    @Transactional
    public void delete(Long id, Long currentUserId) {
        Post post = findPostOrThrow(id);
        requireAuthor(post, currentUserId);
        postRepository.delete(post);
    }

    private Post findPostOrThrow(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
    }

    private void requireAuthor(Post post, Long currentUserId) {
        if (currentUserId == null || !post.isAuthoredBy(currentUserId)) {
            throw new BusinessException(ErrorCode.NOT_AUTHOR);
        }
    }
}
