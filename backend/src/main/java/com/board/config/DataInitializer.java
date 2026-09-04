package com.board.config;

import com.board.post.Post;
import com.board.post.PostRepository;
import com.board.user.User;
import com.board.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

/**
 * H2 인메모리 DB 라서 기동할 때마다 기본 계정과 샘플 공지 게시글을 시드한다.
 * 기본 계정: user1 / password1!  (홍길동),  user2 / password2!  (김철수)
 */
@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PostRepository postRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        User user1 = userRepository.save(new User("user1", passwordEncoder.encode("password1!"), "홍길동"));
        User user2 = userRepository.save(new User("user2", passwordEncoder.encode("password2!"), "김철수"));

        List<String[]> samples = List.of(
                new String[]{"[필독] 공지 게시판 이용 안내", "게시글 등록/수정/삭제는 로그인 후 이용할 수 있습니다."},
                new String[]{"시스템 정기 점검 안내", "매주 일요일 02:00~04:00 정기 점검이 진행됩니다."},
                new String[]{"개인정보 처리방침 개정 안내", "개정된 개인정보 처리방침이 다음 달 1일부터 적용됩니다."},
                new String[]{"신규 기능 배포 안내", "게시글 검색 기능이 추가되었습니다. 제목/내용/작성자로 검색해 보세요."},
                new String[]{"고객센터 운영시간 변경", "고객센터 운영시간이 평일 09:00~18:00 로 변경됩니다."},
                new String[]{"보안 강화를 위한 비밀번호 변경 권고", "3개월 이상 변경하지 않은 계정은 비밀번호를 변경해 주세요."},
                new String[]{"설 연휴 고객센터 휴무 안내", "설 연휴 기간 고객센터는 휴무입니다. 문의는 게시판을 이용해 주세요."},
                new String[]{"서버 증설 완료 안내", "트래픽 증가에 대응해 서버를 증설했습니다. 응답 속도가 개선됩니다."},
                new String[]{"이용약관 개정 안내", "이용약관 일부 조항이 개정되었습니다. 자세한 내용을 확인해 주세요."},
                new String[]{"모바일 화면 개선 안내", "모바일 환경에서의 목록/상세 화면 레이아웃을 개선했습니다."},
                new String[]{"스팸성 게시물 관리 강화", "스팸/광고성 게시물은 예고 없이 삭제될 수 있습니다."},
                new String[]{"만족도 조사 참여 요청", "서비스 개선을 위한 만족도 조사에 참여해 주시면 감사하겠습니다."}
        );

        for (int i = 0; i < samples.size(); i++) {
            String[] s = samples.get(i);
            User author = (i % 2 == 0) ? user1 : user2;
            postRepository.save(new Post(s[0], s[1], author));
        }
    }
}
