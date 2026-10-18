# Clock Pet

초 단위까지 보여주는 귀여운 펫 시계 PWA. iPhone 상태바 시계에는 초가 없어서 만들었다.

- 고양이·강아지·토끼·곰 중 펫 선택, 24/12시간제, 날짜 표시 설정
- 매분 55초부터 들썩이고, 정각엔 점프하고, 밤(23–6시)엔 졸아요
- iPhone Safari에서 공유 → "홈 화면에 추가"로 앱처럼 사용

```bash
npm install
npm run dev     # 개발 서버
npm run build   # dist/ 정적 빌드
npm run icons   # public/pet.svg 수정 후 아이콘 재생성
```

`main` 브랜치에 push하면 GitHub Actions가 빌드해서 GitHub Pages로 배포한다.
