# 피비 GO — HANDOFF

명조 페비츄비 **비공식 무료 팬게임**. 아이폰 Safari PWA, GitHub Pages 배포.
동네를 걸으며 야생 피비를 찾고 → AR로 만나서 → 딸기·쓰다듬기·말 걸기로 친구 만들기 → 도감·사진.

## 현재 버전: `pebigo-v3`

### v3에서 바뀐 것
- **얼굴 수정**: 먹보 피비가 가끔 쓰던 `eye_food`(작은 딸기눈)와 `eye_side`가 위치가 안 맞아 얼굴이 이상했음 → 안 쓰게 함. 딸기 날아올 때는 `star` 눈.
- **바닥에 붙게**
  - 조우 시작하면 **바닥 조준점(흰 링)** → 바닥을 탭한 자리에 피비가 나옴 (아무 데나 뜨지 않음)
  - 폰 높이 = 설정의 **내 키 × 0.8** (기본 160cm → 1.28m)
  - 카메라 화각을 실제 영상 크기로 계산 (`CFG.camLongFov` 67°) → 폰 돌릴 때 덜 미끄러짐
  - 그림자 진하게, 🎯 = 다시 놓기
- **지도**: GPS(폰 안에서만) + 지도 이미지 없는 잔디 지도(타일 서버 X → 위치 안 샘)
  - 70m 격자 × 20분 시간창으로 피비 스폰 (같은 자리 = 같은 피비, 친구 되면 그 창 동안 사라짐)
  - 35m 안이면 탭해서 조우, 🍓 덤불(40m, 5분 쿨) 탭하면 딸기 +3~5
  - 7m/s 넘게 빠르면 "탈것에선 피비가 숨어요" + 스폰 숨김
  - 걸은 거리 기록, 드래그로 지도 돌리기/확대, 🧭 초기화
  - **테스트 모드**: 위치 없이(또는 설정에서) 땅을 탭하면 가상으로 걸어감
- **색 / 희귀도 6종**: 기본(흔함) · 딸기우유★ · 민트★ · 라벤더★★ · 은하수★★ · 반짝 황금★★★
  - 머리·리본 색만 바꿈 (`recolorCanvas`: 머리 = r>150 & g-b>25, 파란 소품 = b>r+35)
  - 희귀할수록 호감 오르는 속도 느림 (`RARE_MUL`)
- **도감**: 내 피비(이름 바꾸기·놓아주기), 색 도감 6칸, 성격 4종, 통계
- **사진**
  - 조우 중 📸 → 카메라+피비 합성 사진(워터마크) → 공유/저장
  - 도감에서 피비 그림 누르면 **AR Quick Look**(`pebi_색.usdz`) → 진짜 바닥에 세우고 아이폰 카메라로 사진·영상
- 딸기는 이제 전체 인벤토리 (`S.berries`, 처음 20개)

### 폰에서 볼 것
| 증상 | 조절 |
|---|---|
| 피비가 떠 보임/파묻힘 | 설정 → 내 키 |
| 폰 돌릴 때 피비가 미끄러짐 | `CFG.camLongFov` (67 → 60~72) |
| 너무 작음/큼 | 설정 → 피비 크기 |
| 지도에 피비가 너무 많음/적음 | `nearbyThings()`의 `q<0.42?1:q<0.55?2:0` |
| 조우 거리 | `CFG.encR` |

## 파일 (전부 레포 루트, 폴더 없음)
```
index.html   sw.js(VERSION 올리기!)   manifest.webmanifest   HANDOFF.md
pebi.glb     face.json   tex.json   voice.json   hairpatch.json(미사용)
pebi_gold.usdz … pebi_shiny.usdz   AR Quick Look용 (색별, 약 1.7MB, 72cm)
icon-180/192/512.png
```

## 코드 지도 (index.html, 한 파일)
- **세이브** `S` (`pebigo-save-v1` 키, v:3): friends[{id,name,trait,color,at}], berries, gone{스폰id:만료}, bush{id:시각}, seen{색}, walked, height, size, sound, test
- **색** `COLORS`, `recolorCanvas`, `colorTex(k)`, `applyColor(k)` (현재 색 + 기본만 GPU에 둠)
- **얼굴** `buildFaceDecal` `drawFaceImgs` `currentExpr` `updateFace` — 표정 이미지 중 `eye_normal/blink/happy/cry/angry/dizzy/heart/pain/sad/squeeze/star/sulk/surprise`와 첫 줄 입 모양만 씀 (나머지 추가분은 위치가 안 맞음)
- **자세** `targetPose` → `pose` → `rot()`
- **AR** `updateCamera`(자이로) `updateFov` `groundAt` `placePet` `doThrow` `berryTick` `addLove` `befriend` `takeShot`
- **지도** `startGeo` `onFix` `nearbyThings`(스폰) `refreshMapObjects` `mapTick` `mapUp`(탭)
- **도감** `renderDex` `openDetail`
- **스냅샷** `makeSnapshots()` 로드 때 색별 256px 그림 → 지도 스프라이트·도감·친구 카드
- **USDZ 굽기** `window.PGO_bake(k)` → 포즈 잡힌 메시+색 텍스처 반환. 헤드리스 크롬에서 호출 후 Python `usd-core`로 usdz 만듦 (UV는 st=(u,1-v))
- 외곽선: `renderOutlined(scene,cam)` — 새 메시는 `layers.enable(1)`

## 개인정보
- 위치: `watchPosition` 결과는 메모리 + 걸은 거리 합계만 저장. 어디에도 전송 X, 지도 타일 요청 X
- 카메라: 조우 화면에서만 켜고 지도로 가면 끔. 사진은 누를 때만 폰 안에서 합성

## 다음 후보
- 걸은 거리 보상(알·딸기), 친구 피비 데리고 다니기(지도에 따라오기)
- 성격별 특수 행동, 날씨/시간대 스폰
- 도감에서 3D로 돌려보기
- 아이콘 피비 GO 전용으로 교체

## 변경 기록
- v1: 조우 화면
- v2: 폴더 없이 루트 배치 (폰 업로드 때 폴더가 날아가서)
- v3: 얼굴 수정, 바닥 놓기, 지도·스폰·덤불, 색/희귀도, 도감, 📸 사진, AR Quick Look
