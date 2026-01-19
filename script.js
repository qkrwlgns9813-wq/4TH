// --- 1. Mock Database (Based on standard Lifelong Learning Data Schema) ---
const courseDatabase = [
    { id: 1, name: "직장인을 위한 힐링 요가", category: "체육", content: "스트레스 해소와 체력 증진", fee: 40000, region: "서울", days: "weekday", time: "evening", activityLevel: 8, cognitiveLevel: 3, description: "신체 활동을 통한 정서 안정을 돕는 인기 프로그램입니다." },
    { id: 2, name: "인공지능 트렌드와 파이썬 기초", category: "기술", content: "디지털 리터러시 및 실무 역량", fee: 0, region: "수원", days: "weekend", time: "morning", activityLevel: 1, cognitiveLevel: 9, description: "최신 기술 동향 파악과 실무 도구 학습에 최적화되어 있습니다." },
    { id: 3, name: "수채화로 그리는 도심 풍경", category: "문화예술", content: "창의적 사고와 예술적 감성 함양", fee: 80000, region: "인천", days: "weekday", time: "afternoon", activityLevel: 3, cognitiveLevel: 6, description: "예술 활동은 성인 학습자의 창의적 자기 표현에 효과적입니다." },
    { id: 4, name: "인문학으로 보는 서양 역사", category: "인문학", content: "폭넓은 세계관과 역사 지식", fee: 20000, region: "용인", days: "weekday", time: "evening", activityLevel: 1, cognitiveLevel: 8, description: "체계적인 이론 학습을 통해 지적 욕구를 충족할 수 있습니다." },
    { id: 5, name: "생활 속의 테니스 교실", category: "체육", content: "활동적인 스포츠와 사회적 교류", fee: 0, region: "서울", days: "weekend", time: "afternoon", activityLevel: 10, cognitiveLevel: 2, description: "높은 활동성은 뇌 활력을 높이고 스트레스를 낮추는 데 탁월합니다." },
    { id: 6, name: "시니어 스마트폰 활용 교육", category: "기술", content: "실질적 생활 편의와 디지털 소외 해소", fee: 0, region: "광명", days: "weekday", time: "morning", activityLevel: 2, cognitiveLevel: 5, description: "생활 적응력을 높이는 실습 위주의 커리큘럼입니다." },
    { id: 7, name: "커피 바리스타 자격증 과정", category: "직업특화", content: "전문 역량 개발과 창업 준비", fee: 120000, region: "성남", days: "weekend", time: "afternoon", activityLevel: 6, cognitiveLevel: 7, description: "이론과 실습을 병합하여 성취감을 높이는 과정입니다." },
    { id: 8, name: "명상과 마음챙김 산책", category: "체육", content: "정서 순화와 걷기 명상", fee: 10000, region: "서울", days: "any", time: "morning", activityLevel: 5, cognitiveLevel: 4, description: "심리적 안정과 가벼운 신체 활동을 동시에 제안합니다." }
];

// --- 2. Application Logic ---
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('hero').classList.add('hidden');
    document.getElementById('survey').classList.remove('hidden');
    window.scrollTo(0, 0);
});

document.getElementById('recommendation-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const surveyData = Object.fromEntries(formData.entries());

    // Analyze and Generate Results
    const analysis = analyzeUser(surveyData);
    const recommendations = generateRecommendations(surveyData, analysis);

    renderResults(analysis, recommendations, surveyData);
});

function analyzeUser(data) {
    // A. Physical Activity Suitability Index (신체 활동 적합도 지수)
    let physicalScore = 50;
    if (data.activity === 'active') physicalScore += 30;
    if (data.activity === 'static') physicalScore -= 20;
    if (data.exercise === 'high') physicalScore += 20;
    if (data.exercise === 'none') physicalScore -= 10;
    physicalScore = Math.max(0, Math.min(100, physicalScore));

    // B. Cognitive Expansion Type Classification (인지적 확장 유형)
    let cognitiveScore = 50;
    if (['engineering', 'humanities'].includes(data.major)) cognitiveScore += 20;
    if (data.purpose === 'growth' || data.purpose === 'career') cognitiveScore += 30;
    if (data.purpose === 'stress') cognitiveScore -= 20;
    cognitiveScore = Math.max(0, Math.min(100, cognitiveScore));

    // C. Reality Constraint Index (현실적 수강 가능성 - 필터링 기준)
    let accessibilityIndex = 0;
    if (data.budget === '999999') accessibilityIndex += 40;
    else if (parseInt(data.budget) > 50000) accessibilityIndex += 20;

    return {
        physical: physicalScore,
        cognitive: cognitiveScore,
        accessibility: accessibilityIndex + 50 // Base level
    };
}

function generateRecommendations(survey, analysis) {
    const scoredCourses = courseDatabase.map(course => {
        let score = 0;

        // Match Physical Level
        const physicalMatch = 100 - Math.abs((analysis.physical / 10) - course.activityLevel) * 10;
        score += (physicalMatch * 0.4);

        // Match Cognitive Level
        const cognitiveMatch = 100 - Math.abs((analysis.cognitive / 10) - course.cognitiveLevel) * 10;
        score += (cognitiveMatch * 0.4);

        // Reality Filters (Hard Constraints get Penalty)
        // Region
        if (!survey.location.includes(course.region)) score -= 20;

        // Budget
        if (parseInt(survey.budget) < course.fee) score -= 50;

        // Day/Time
        if (survey.day !== 'any' && course.days !== 'any' && survey.day !== course.days) score -= 15;
        if (survey.time !== 'any' && course.time !== 'any' && survey.time !== course.time) score -= 15;

        return { ...course, score: Math.round(score) };
    });

    return scoredCourses.sort((a, b) => b.score - a.score).slice(0, 4);
}

// --- 3. Visualization and Rendering ---
let charts = {};

function renderResults(analysis, recommendations, survey) {
    document.getElementById('survey').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
    window.scrollTo(0, 0);

    // Profile Chart
    const profileCtx = document.getElementById('profileChart').getContext('2d');
    if (charts.profile) charts.profile.destroy();
    charts.profile = new Chart(profileCtx, {
        type: 'radar',
        data: {
            labels: ['활동성', '인지 학습 성향', '현실적 유연성', '목표 지향성', '경험 개방성'],
            datasets: [{
                label: '학습자 분석 지수',
                data: [analysis.physical, analysis.cognitive, analysis.accessibility, 80, 70],
                backgroundColor: 'rgba(30, 55, 153, 0.2)',
                borderColor: 'rgba(30, 55, 153, 1)',
                borderWidth: 2
            }]
        },
        options: { scales: { r: { min: 0, max: 100 } } }
    });

    // Distribution Chart
    const distCtx = document.getElementById('distributionChart').getContext('2d');
    if (charts.dist) charts.dist.destroy();
    charts.dist = new Chart(distCtx, {
        type: 'pie',
        data: {
            labels: ['체육', '기술', '문화/예술', '인문학'],
            datasets: [{
                data: [
                    analysis.physical > 60 ? 40 : 15,
                    analysis.cognitive > 70 ? 35 : 20,
                    20,
                    analysis.cognitive > 50 ? 25 : 10
                ],
                backgroundColor: ['#1e3799', '#4a69bd', '#079992', '#f8c291']
            }]
        }
    });

    // Expert Feedback
    const expertText = document.getElementById('expert-text');
    let feedback = "";

    if (analysis.physical > 65) {
        feedback += `<p><strong>[신체 활동 및 인지 학습 관계]</strong> 많은 교육 전문가들과 의료계 연구 결과에 따르면, 적정 수준의 신체 활동은 성인의 학습 지속성과 정서 안정에 결정적인 영향을 미칩니다. 귀하의 성향을 분석한 결과 강도 높은 신체 활동이 결합된 강좌에서 학습 만족도가 가장 높을 것으로 예측됩니다.</p>`;
    } else {
        feedback += `<p><strong>[인지적 확장 및 정서적 안정]</strong> 성인 학습 이론에 따르면, 학습자는 자신의 생활 환경과 직접적으로 관련된 지식을 습득할 때 높은 동기부여를 경험합니다. 귀하의 정적이고 분석적인 경향은 심도 있는 이론적 탐구를 통해 더 큰 자아실현을 이룰 가능성이 큽니다.</p>`;
    }

    feedback += `<p><strong>[현실적 수강 전략]</strong> "최적의 학습은 현실의 한계를 존중하는 것에서 시작한다"는 전문가들의 조언처럼, 귀하가 입력하신 ${survey.location} 지역 기반의 정보와 시간적 여건을 최우선으로 고려하였습니다. 제안된 강좌들은 귀하의 라이프스타일을 방해하지 않으면서 새로운 도전을 가능하게 할 것입니다.</p>`;

    expertText.innerHTML = feedback;

    // Recommendations List
    const list = document.getElementById('recommendation-list');
    list.innerHTML = '';

    recommendations.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card fade-in';
        card.innerHTML = `
            <div class="course-header">
                <span class="course-category">${course.category}</span>
                <h4>${course.name}</h4>
            </div>
            <div class="course-body">
                <div class="course-info">
                    <div><span>비용</span> <strong>${course.fee === 0 ? '무료' : course.fee.toLocaleString() + '원'}</strong></div>
                    <div><span>지역</span> <strong>${course.region} 기반</strong></div>
                    <div><span>시간</span> <strong>${course.days}/${course.time}</strong></div>
                </div>
                <div class="course-reason">
                    <p>${course.description}</p>
                    <div class="tag-match" style="margin-top:10px">적합도 ${course.score}% 일치</div>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}
