# 피비 GO — HANDOFF

명조 페비츄비 **비공식 무료 팬게임**. 현실(카메라) 위에 야생 피비가 나타나고, 딸기·쓰다듬기·말 걸기로 호감도를 채우면 내 피비가 됨.
아이폰 Safari 기준 PWA, GitHub Pages 배포 (페비츄비 키우기와 별도 레포).

## 현재 버전: `pebigo-v2` (1단계: AR 조우 화면)

### 된 것
- 시작 화면: 비공식 표기, ⚠️ 주변 조심, 카메라/저장 안내 → "확인했어, 시작!" 탭에서 자이로 권한 + 카메라 권한 동시 요청
- 카메라(getUserMedia, 후면) 배경 + 자이로(DeviceOrientation) → three.js 카메라 방향. 피비는 월드에 고정 (폰 높이 1.35m, 앞 2m 바닥)
- 폴백: 카메라 거부 → 하늘/잔디 배경, 자이로 거부/없음 → 손가락 드래그로 둘러보기
- 피비 모델·얼굴 데칼 표정·목소리·스티커 외곽선 (페비츄비 키우기에서 이식)
- 🍓 딸기 위로 밀어서 던지기 (포고 방식: 미는 세기 = 떨어지는 거리, 좌우로 비틀면 휨)
  - 받아먹기 +14 / 머리 쪽 살살 = 나이스 +4 / 세게 머리 맞음 = 어지러움 -6 (2번 연속이면 울음)
  - 근처 바닥에 떨어지면 걸어가서 주워먹기 +7, 멀리 떨어지면 삐짐
- ✋ 문지르기 = 쓰다듬기 (연속 4번↑ 하트 눈), 톡 = 깜짝
- 💬 말 걸기 (호감 단계별 대사, 반복하면 효과 감소)
- 성격 4종: 먹보(딸기↑, 받기 판정↑) / 애교쟁이(쓰다듬기↑) / 새침데기(호감 30 전엔 쓰다듬으면 화냄, 말 걸기↑) / 수줍음(초반 부끄러움)
- 호감 100 → 만세 → 친구 카드(이름 짓기) → localStorage 저장 → 다음 피비
- 화면 밖이면 방향 화살표, 🎯 앞으로 부르기, 🔊 소리, ❔ 안내, 3분마다 주변 조심 알림
- 딸기 조우당 10개, 다 쓰면 "🍓 더 받기(테스트)" (지도 붙이면 걸어서 모으기로 교체)

### 폰에서 볼 것 (느낌 조절 포인트)
`index.html` 안 `CFG` 한 곳에서 조절:
| 키 | 기본 | 의미 |
|---|---|---|
| eye | 1.35 | 폰 높이(m). 피비가 떠 보이면 올리고, 파묻혀 보이면 내림 |
| dist | 2.0 | 피비 등장 거리(m) |
| scale | 0.42 | 피비 크기 (약 70cm) |
| fov | 60 | 카메라 세로 화각. 걸을 때 피비가 미끄러지면 조절 |
| grav | 7.0 | 딸기 중력 (낮을수록 둥실) |
| berries | 10 | 조우당 딸기 |
| catchR | 0.30 | 받아먹기 판정 반경 |
던지기 세기 매핑: `doThrow()` — `power=(위로 민 속도-500)/2000`, 목표 거리 `0.6+power*4.0`m.

## 파일 구조 (전부 레포 루트에 평평하게, 폴더 없음 — 폰 업로드용)
```
index.html  sw.js(VERSION 올리기!)  manifest.webmanifest  HANDOFF.md
pebi.glb        피비 3D 모델
face.json       표정 PNG 조각 {키:{x,y,d}} (1024x576 얼굴 캔버스 기준)
tex.json        얼굴 지운 텍스처 변형 e/m/em/n (em 사용)
voice.json      목소리 angry/cry/happy/sulk/talk
hairpatch.json  모자 벗은 머리 패치 (아직 안 씀)
icon-180/192/512.png  페비츄비 키우기 아이콘 재사용
```

## 코드 지도 (index.html)
- `CFG` 설정 / `S` 세이브(`pebigo-save-v1`: friends[], met, sound)
- 얼굴: `buildFaceDecal` `drawFaceImgs` `currentExpr` `updateFace` (원작 그대로 이식, 절차적 그리기 폴백은 뺌)
- 자세: `targetPose`(애니별 목표) → `pose`(스프링) → `rot()` 뼈 회전. 애니: appear wave hop look pat shy poke eat dizzy angry sulk cry heart banzai
- 입 위치: `MOUTH_LOCAL` (로드 때 머리뼈 로컬로 계산) → `mouthWorld()` 받아먹기 판정·먹는 딸기 위치
- 딸기: `doThrow` `berryTick` `catchBerry` `bonk` `landed`
- 입력: 딸기 버튼 pointer(던지기), 캔버스 pointer(쓰다듬기/톡/드래그 둘러보기)
- 조우: `newEncounter` `befriend` / 배회: `move`
- 자이로: `onOri` `oriQuat`(DeviceOrientationControls 수식) `updateCamera`
- 외곽선: `renderOutlined` (레이어1 렌더 → 셰이더 합성). **새 메시를 외곽선에 넣으려면 `layers.enable(1)`**
- 권한: `onStart` — iOS는 버튼 탭 안에서 `DeviceOrientationEvent.requestPermission()`과 `getUserMedia`를 바로 호출해야 함

## 배포
1. 새 레포 (예: `pebi-go`) → zip 풀어서 파일 전부 루트에 올리기 (zip 자체는 올리지 않기)
2. Settings → Pages → Branch `main` / `(root)`
3. 아이폰 Safari로 `https://<아이디>.github.io/pebi-go/` → 공유 → 홈 화면에 추가
- 카메라·자이로는 https에서만 됨 (GitHub Pages OK, 파일 직접 열기 X)
- 업데이트가 안 보이면: sw.js VERSION 올렸는지 확인 → 앱 완전 종료 후 재실행

## 다음 단계 후보
1. 🗺️ 지도 (Geolocation, 폰 안에서만) — 주변 야생 피비 스폰, 가까이 가면 이 조우 화면 열기
2. 🎨 색/희귀도 (텍스처 색조 변형) + 성격과 묶기
3. 📖 도감 & 컬렉션 (S.friends 이미 저장 중)
4. 📸 사진 모드: USDZ + `<a rel="ar">` AR Quick Look
5. 딸기를 걸어서 모으기 (지금은 테스트용 +5 버튼)

## 변경 기록
- v1 (2026-09-28): 1단계 조우 화면 첫 버전
- v2: 폴더 없이 루트에 평평하게 (폰 GitHub 업로드는 폴더가 안 올라가서 assets/ 경로 404 났음)
