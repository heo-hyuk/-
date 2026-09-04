package com.board.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Override
    @EntityGraph(attributePaths = "author")
    Page<Post> findAll(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = "author")
    Optional<Post> findById(Long id);

    /**
     * 검색 목록. type 이 title/content/author 면 해당 필드만, all 이면 3개 필드 OR 검색.
     */
    @EntityGraph(attributePaths = "author")
    @Query("""
            select p from Post p
            where (:type = 'title'   and lower(p.title)   like lower(concat('%', :keyword, '%')))
               or (:type = 'content' and lower(p.content) like lower(concat('%', :keyword, '%')))
               or (:type = 'author'  and lower(p.author.nickname) like lower(concat('%', :keyword, '%')))
               or (:type = 'all' and (
                        lower(p.title)   like lower(concat('%', :keyword, '%'))
                     or lower(p.content) like lower(concat('%', :keyword, '%'))
                     or lower(p.author.nickname) like lower(concat('%', :keyword, '%'))
                   ))
            """)
    Page<Post> search(@Param("type") String type, @Param("keyword") String keyword, Pageable pageable);
}
