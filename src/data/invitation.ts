import memoryImage from "../assets/skii_puzzle_image.jpg";

export const invitation = {
  intro: {
    eyebrow: "PARTY ENTRY TEST",
    title: "이 파티는 아무나 들어올 수 없다.",
    body: "(사실 아무나 가능)",
    cta: "입장하기",
  },
  puzzle: {
    title: "1차 검문: 추억 팔이",
    body: "퍼즐을 맞추거라",
    image: memoryImage,
    imageAlt: "초대장 주인과의 추억이 담긴 사진 조각",
    success: "통과.",
  },
  cardDraw: {
    title: "3차 검문: 행운의 카드 뽑기",
    body: "운빨 테스트",
    retry: "꽝. 다시 시도!",
    success: "럭키카야의 행운이 깃들었습니다.",
    cards: ["1번 카드", "2번 카드", "3번 카드", "4번 카드"],
  },
  party: {
    title: "이걸 다 통과하다니 내 친구가 맞구나",
    date: "2026년 4월 19일 일요일",
    time: "오후 7시",
    location: "영통 어딘가",
    dressCode: "턱시도 & 드레스",
    message: "그에게 주어지는 합격 목걸이",
  },
  rsvp: {
    title: "최종 선택",
    body: "올 거지?",
    choices: ["간다", "당연히 간다", "무조건 간다"],
    done: "출석 확정. 당신의 역할은",
    roles: [
      "DJ",
      "파파라치",
      "케이크 경호원",
      "지가은 매니저",
      "팔리아치",
      "보안 요원",
      "기미상궁",
    ],
  },
};

export const storySteps = [
  {
    text: "스키장에 갔던 날짜는?",
    choices: [
      {
        label: "12/26",
        feedback: "다시 생각해봐.",
      },
      {
        label: "12/27",
        feedback: "좋은 선택이다.",
        isCorrect: true,
      },
      {
        label: "12/28",
        feedback: "다시 생각해봐.",
      },
    ],
  },
  {
    text: "내 인생 영화는?",
    choices: [
      {
        label: "인터스텔라",
        feedback: "명작이긴 해",
      },
      {
        label: "라라랜드",
        feedback: "노래는 좋긴 해",
      },
      {
        label: "프로젝트 헤일메리",
        feedback: "amaze amaze amaze",
        isCorrect: true,
      },
    ],
  },
  {
    text: "오늘 가져올 준비물은?",
    choices: [
      {
        label: "신나는 마음",
        feedback: "좋다. 근데 아직 덜 감동적이야.",
      },
      {
        label: "축하하는 마음",
        feedback: "모범 답안. 합격~!!",
        isCorrect: true,
      },
    ],
  },
];
