# 🧪 Evidence-Based Testing Guide for Lumen AI

## 🎯 Overview

This guide demonstrates how to test Lumen's comprehensive evidence-based mental health AI system. All features are grounded in peer-reviewed research and validated clinical instruments.

## 🚀 Quick Start Testing

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

### 2. Open Test Interface

Navigate to: `http://localhost:5001/test-frontend/`

## 📋 Testing Scenarios by Clinical Evidence

### 🧠 Scenario 1: Depression Assessment (PHQ-9 Based)

**Clinical Context**: Testing AI's ability to identify depression indicators using PHQ-9 validated criteria.

**Test Steps**:

1. **Navigate to Journal Tab → Audio**
2. **Record or upload audio** saying:
   ```
   "I've been feeling really down lately. Nothing seems interesting anymore, 
   not even things I used to love doing. I'm tired all the time, can't focus 
   at work, and I keep thinking I'm worthless. I've been having trouble 
   sleeping and just feel hopeless about everything."
   ```

3. **Expected AI Analysis**:
   - **PHQ-9 Indicators Detected**: Anhedonia, fatigue, concentration issues, worthlessness, sleep disturbance, hopelessness
   - **Risk Assessment**: Medium to High
   - **CBT Interventions**: Behavioral activation, cognitive restructuring for hopelessness
   - **Audio Analysis**: Slower speech rate, reduced vocal variation (depression biomarkers)

### 🌊 Scenario 2: Anxiety Assessment (GAD-7 Based)

**Clinical Context**: Testing GAD-7 anxiety screening with DBT interventions.

**Test Steps**:

1. **Create Text Journal Entry**:
   ```
   Content: "I can't stop worrying about everything. My mind races constantly, 
   I feel restless and on edge. I worry about work, relationships, health - 
   you name it. I can't relax and it's making me irritable with everyone."
   
   Mood: anxiety
   Tags: work, worry, restlessness
   ```

2. **Expected AI Analysis**:
   - **GAD-7 Indicators**: Excessive worry, restlessness, relaxation difficulty, irritability
   - **DBT Skills Recommended**: TIPP for acute distress, mindfulness for worry reduction
   - **MBSR Techniques**: Breath awareness meditation, body scan
   - **Intensity Adjustment**: Likely +1 or +2 based on severity

### 🌟 Scenario 3: Trauma-Informed Assessment

**Clinical Context**: Testing PTSD-5 screening with trauma-informed care principles.

**Test Steps**:

1. **Audio Journal Entry** (simulate with file upload):
   ```
   "I keep having these flashbacks to the accident. I can't drive anymore, 
   I avoid that whole part of town. I feel disconnected from everyone, 
   like I'm watching my life from outside. I'm always on high alert, 
   jumping at every sound."
   ```

2. **Expected AI Analysis**:
   - **PTSD-5 Indicators**: Re-experiencing, avoidance, emotional numbing, hypervigilance
   - **Trauma-Informed Approach**: Safety prioritization, window of tolerance assessment
   - **Interventions**: Grounding techniques, nervous system regulation
   - **Professional Referral**: Likely recommended for specialized trauma therapy

### 💊 Scenario 4: Comprehensive Clinical Assessment

**Clinical Context**: Testing multi-modal analysis with neurobiological considerations.

**Test Steps**:

1. **Create Multiple Data Points**:
   - **Emotion Entry**: Frustration, intensity 7
   - **Journal Entry**: "Stressed about work deadline, sleeping poorly"
   - **Game Session**: 45 minutes, emotionBefore: stress, completed

2. **Navigate to Clinical Analytics Tab**
3. **Click "Get Clinical Overview"**

4. **Expected Comprehensive Analysis**:
   - **HPA Axis Assessment**: Stress response pattern identification
   - **Sleep-Mood Connection**: Circadian rhythm impact analysis
   - **Polyvagal Theory Application**: Nervous system state assessment
   - **Neuroplasticity Recommendations**: Brain-training activities

## 🎙️ Audio Analysis Testing

### Voice Biomarker Detection

**Test Audio Samples** (record or simulate):

1. **Depression Sample**: Slow, monotone speech with long pauses
2. **Anxiety Sample**: Rapid speech with vocal tremor
3. **Neutral Sample**: Normal pace and variation

**Expected Voice Analysis**:
- **Transcription Accuracy**: Complete speech-to-text conversion
- **Emotional Tone**: Detected from prosody and pace
- **Clinical Indicators**: Research-backed voice biomarkers
- **Speech Patterns**: Coherence, processing time, thought organization

## 📊 Evidence-Based Intervention Testing

### CBT Technique Recommendations

**Test with Various Scenarios**:

1. **Catastrophizing Pattern**:
   ```
   Journal: "Everything is going to go wrong at the presentation. 
   I'll mess up, everyone will think I'm incompetent, and I'll lose my job."
   ```
   
   **Expected CBT Response**:
   - Cognitive distortion identified: Catastrophizing, fortune telling
   - Technique: Thought challenging, evidence examination
   - Behavioral experiment: Gradual exposure to presentation scenarios

2. **All-or-Nothing Thinking**:
   ```
   Journal: "I made one mistake on the project so I'm a complete failure. 
   I can never do anything right."
   ```
   
   **Expected CBT Response**:
   - Distortion: All-or-nothing thinking, labeling
   - Technique: Gray-area thinking, self-compassion exercises
   - Homework: Daily accomplishment logging

### DBT Skills Integration

**Test Distress Tolerance Scenarios**:

1. **Crisis Situation**:
   ```
   Audio: "I'm so overwhelmed I want to hurt myself. Everything feels 
   too much and I don't know how to cope."
   ```
   
   **Expected DBT Response**:
   - **Immediate**: TIPP techniques for crisis survival
   - **Risk Assessment**: High risk, safety planning needed
   - **Skills**: Distress surfing, radical acceptance
   - **Professional Alert**: Crisis intervention protocols

## 🔬 Research Integration Testing

### Clinical Citation Verification

**Check AI Responses for**:
- Research citations (Hofmann et al., 2012 for CBT)
- Effect sizes (d = 0.75 for anxiety CBT)
- Randomized controlled trial references
- Meta-analysis evidence inclusion

### Validation Tool Implementation

**Verify AI Uses**:
- PHQ-9 criteria for depression screening
- GAD-7 indicators for anxiety assessment
- Columbia Suicide Risk Assessment protocols
- SAMHSA trauma-informed care principles

## 📈 Healthcare Outcome Metrics Testing

### Functional Assessment

**Test with Activity Data**:
1. **Create Game Sessions**: Multiple days, varying completion
2. **Journal Entries**: Work performance mentions
3. **Emotion Tracking**: Daily mood patterns

**Expected Outcome Analysis**:
- Functional improvement indicators
- Work/life impact assessment
- Social functioning evaluation
- Quality of life metrics

### Progress Tracking

**Test Longitudinal Analysis**:
1. **Create Data Over Time**: Multiple sessions across days
2. **Access Clinical Analytics**: Look for trend analysis
3. **Verify Improvement Metrics**: Symptom reduction percentages

## 🚨 Risk Assessment Testing

### Safety Planning Protocols

**High-Risk Scenario Testing**:
```
Audio Journal: "I've been thinking about ending my life. I have a plan 
and access to means. I feel hopeless and don't see any point in continuing."
```

**Expected Safety Response**:
- **Immediate Risk Assessment**: High
- **Columbia Protocol Application**: All risk factors identified
- **Crisis Resources**: Provided immediately
- **Professional Referral**: Urgent psychiatric evaluation
- **Safety Planning**: Removal of means, support system activation

### Escalation Protocols

**Test Intervention Triggers**:
- Suicide ideation detection
- Self-harm references
- Severe functional impairment
- Psychotic symptoms indicators

## 🔧 Technical Testing

### API Endpoint Verification

**Test All Evidence-Based Endpoints**:

1. **Audio Journal Creation**: `/api/journal/audio`
2. **Clinical Analytics**: `/api/clinical-analytics/overview`
3. **Risk Assessment**: `/api/clinical-analytics/risk-assessment`
4. **Evidence-Based Insights**: `/api/clinical-analytics/insights`

### Error Handling

**Test Edge Cases**:
- Audio file format variations
- Large file uploads (20MB limit)
- Invalid mood/emotion combinations
- Missing required fields

## 📋 Success Criteria Checklist

### ✅ Clinical Accuracy
- [ ] PHQ-9 criteria correctly identified
- [ ] GAD-7 indicators properly assessed
- [ ] PTSD-5 screening functional
- [ ] Columbia suicide risk assessment working

### ✅ Evidence-Based Interventions
- [ ] CBT techniques with research citations
- [ ] DBT skills with proper protocols
- [ ] MBSR recommendations with evidence
- [ ] Trauma-informed care principles applied

### ✅ Audio Analysis
- [ ] Accurate transcription
- [ ] Voice biomarker detection
- [ ] Emotional tone analysis
- [ ] Clinical speech pattern recognition

### ✅ Risk Management
- [ ] Appropriate risk stratification
- [ ] Safety planning triggers
- [ ] Crisis intervention protocols
- [ ] Professional referral criteria

### ✅ Healthcare Integration
- [ ] Standardized assessment tools
- [ ] Measurable outcome metrics
- [ ] Clinical workflow compatibility
- [ ] Professional-grade documentation

## 🎯 Hackathon Demonstration Flow

### Best Healthcare Solution Demo

1. **Show Clinical Relevance**: Demonstrate PHQ-9, GAD-7 integration
2. **Healthcare Outcomes**: Display measurable improvement metrics
3. **Evidence-Based Foundation**: Reference research citations in responses
4. **Ethics & Social Responsibility**: Show cultural competency and safety features

### Best Use of Emerging Technology Demo

1. **Audio AI Integration**: Live voice analysis with Gemini
2. **Real-time Clinical Assessment**: Instant evidence-based feedback
3. **Neurobiological Integration**: Show HPA axis and polyvagal theory application
4. **Comprehensive Data Fusion**: Multi-modal analysis (text, audio, behavioral)

## 📞 Support and Documentation

- **Clinical Evidence Base**: See `CLINICAL_EVIDENCE_BASE.md`
- **Hackathon Criteria**: See `HACKATHON_CRITERIA.md`
- **Implementation Summary**: See `IMPLEMENTATION_SUMMARY.md`
- **API Documentation**: Auto-generated from test interface

---

This testing guide ensures that all evidence-based features are properly validated and demonstrate Lumen's clinical credibility and technological innovation for the hackathon evaluation.