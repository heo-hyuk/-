package com.board.post;

import com.board.common.ApiResponse;
import com.board.post.dto.*;
import com.board.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    /** 목록 조회 (페이징 + 검색) */
    @GetMapping
    public ApiResponse<PageResponse<PostSummaryResponse>> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String keyword
    ) {
        return ApiResponse.success(postService.getPosts(page, size, searchType, keyword));
    }

    /** 상세 조회 (조회수 증가) */
    @GetMapping("/{id}")
    public ApiResponse<PostResponse> getPost(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success(postService.getPost(id, userId(principal)));
    }

    /** 등록 (인증 필요) */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<PostResponse> create(
            @Valid @RequestBody PostCreateRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success("게시글이 등록되었습니다.", postService.create(request, principal.getId()));
    }

    /** 수정 (작성자 본인만) */
    @PutMapping("/{id}")
    public ApiResponse<PostResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody PostUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success("게시글이 수정되었습니다.", postService.update(id, request, principal.getId()));
    }

    /** 삭제 (작성자 본인만) */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        postService.delete(id, principal.getId());
        return ApiResponse.success("게시글이 삭제되었습니다.", null);
    }

    private Long userId(UserPrincipal principal) {
        return principal == null ? null : principal.getId();
    }
}
