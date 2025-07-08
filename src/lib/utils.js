// 클래스 이름을 결합하는 간단한 유틸리티 함수
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
