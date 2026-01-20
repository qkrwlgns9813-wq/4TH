# 1. Git 설정 초기화
git init
# 2. 모든 파일(README.md 포함)을 업로드 대기 상태로 추가
git add .
# 3. 변경사항 확정 (커밋)
git commit -m "Add project files and README"
# 4. 브랜치 이름을 main으로 변경
git branch -M main
# 5. 내 로직과 깃허브 저장소 연결
# (주의: 아래 URL은 본인의 깃허브 주소로 바꿔주세요)
git remote add origin https://github.com/사용자아이디/저장소이름.git
# 6. 최종 업로드
git push -u origin main
