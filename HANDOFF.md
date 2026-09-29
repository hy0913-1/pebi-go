# 피비 GO — HANDOFF

명조 페비츄비 **비공식 무료 팬게임**. 아이폰 Safari PWA, GitHub Pages.
**v4부터 방향 전환:** 지도/스폰 게임 → **카메라 AR로 피비들과 생활하기** (릴스처럼 진짜 방·식당·공원 위에서 먹방·장난·사진·영상).

## 현재 버전: `pebigo-v4`

### 기능
- **놓기**: ➕ → 높이 슬라이더(바닥 0 ~ 테이블 70cm ~ 120cm) → 탭한 면 위에 피비가 앉음. 폰 높이 = 키×0.8
- **여러 마리 (최대 3)**: 🐣에서 추가/이름/색(6색)/다시 놓기/들여보내기/삭제, 아이폰은 AR Quick Look(`pebi_색.usdz`)
- **먹방 41종** (🍽️): 음식마다 반응
  - fav 딸기 → 딸기눈·만세·하트 / sweet → 반짝눈 / yum → 냠냠 폴짝 / big → 오래 먹고 배불러
  - cold → 창백·덜덜 / hot → 눈물·손부채 / spicy → 빨간 얼굴·김·화남→부채 / fire(청양고추) → 뛰어다니다 울기
  - sour → 부들부들 / bitter → 시무룩 / drink → 쪼옥 / hate(브로콜리·당근·버섯) → 안 먹고 밀어냄
  - 배부름 6 이상이면 거절, 1분에 1씩 소화. 다른 피비는 쳐다보며 "나도!"
- **터치**: 머리 톡=쓰담, 몸 톡=콕, 두 번 톡=빙글, 5번 찌르면 화남, 머리 문지르기=좋아함(하트눈), 몸 문지르기=간지럼, 꾹 누르기=볼 꼬집기(2초 넘으면 울음), 잠깐 누른 뒤 끌기=들어서 옮기기(흔들면 어지러움)
- **폰 흔들기** = 지진 (DeviceMotion)
- **혼자 행동**: 앉기/서기, 주변 걷기, 두리번, 피비끼리 수다(CHATS), 40초 방치하면 하품→잠(💤), 배고프다고 조르기
- 🎵 다 같이 춤 (칩튠 음악 생성) · 💬 말 걸기(다른 피비가 대답)
- **자막**: 대사가 릴스처럼 아래에 (설정에서 끄기)
- 📸 사진 / 🎥 영상 녹화(카메라+피비+자막+목소리, 최대 60초, mp4) → 공유/저장

### 구조 (index.html 한 파일)
- `Pebi` 클래스: 인스턴스마다 SkeletonUtils.clone 모델, 얼굴 캔버스·데칼, 자세 스프링, 상태
- `targetPose(p)`/`pose(p)`, `currentExpr(p)`/`updateFace(p)` — 얼굴 그릴 때 전역 `fcv/fg/talkT`를 인스턴스 걸로 바꿔 `drawFaceImgs` 재사용
- 표정 추가분(eye_food, fire, sleepy, sparkle 등)은 위치가 안 맞아서 `fitPart()`로 눈 영역에 맞춰 늘려 그림 (`FITKEYS`)
- 얼굴 효과 `red`(매움), `pale`(추움) = 얼굴 데칼에 그라데이션
- 입력: `onDown/onMove/onUp` → `tapAct/rubAct/pinchStart/liftStart`
- 음식: `FOODS`, `serveFood`, `foodTick`, `finishFood`(반응), `FOODLINE`(대사)
- 행동: `think(p)`, 수다 `CHATS`, 한마디 `IDLE_LINES`
- 녹화: `composite()`(영상+GL+자막+워터마크) → `captureStream` + WebAudio `recDest`
- 세이브 키 `pebigo-v4`: pibis[{id,name,color,out}], height, size, sound, subs

### 조절
| | |
|---|---|
| 떠 보이면 | 설정 → 내 키 / 놓기 높이 |
| 미끄러지면 | `CFG.camLongFov` |
| 새 음식 | `FOODS`에 `[키,이모지,이름,반응]` 추가 |
| 새 대사 | `FOODLINE`, `CHATS`, `IDLE_LINES` |

### 다음 후보
- 구구가가·도로롱 (모델 or 참고 그림 받으면 `Pebi` 틀에 캐릭터 타입 추가)
- 음식 3D 모델, 컵·접시 소품, 피비끼리 음식 뺏어먹기
- 구글 실사 3D 여행 모드 (API 키 생기면)

## 변경 기록
- v1 조우 · v2 루트 배치 · v3 지도/도감
- v4: 카메라 AR 생활로 갈아엎음, 여러 마리, 먹방 41종, 터치 상호작용, 자막, 영상 녹화
