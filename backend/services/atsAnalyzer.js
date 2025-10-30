// ATS (Applicant Tracking System) Analyzer
// Analyzes resumes for ATS compatibility and provides scoring

export function analyzeResume(resumeData) {
  let score = 0;
  const feedback = [];
  const suggestions = [];

  // Check contact information (10 points)
  if (resumeData.personalInfo) {
    const { email, phone, fullName } = resumeData.personalInfo;
    if (email && phone && fullName) {
      score += 10;
      feedback.push({
        type: 'success',
        category: 'Contact Info',
        message: 'Complete contact information provided'
      });
    } else {
      feedback.push({
        type: 'error',
        category: 'Contact Info',
        message: 'Missing contact information'
      });
      suggestions.push('Add email, phone number, and full name');
    }
  }

  // Check summary/objective (10 points)
  if (resumeData.summary && resumeData.summary.length >= 50) {
    score += 10;
    feedback.push({
      type: 'success',
      category: 'Summary',
      message: 'Professional summary included'
    });
  } else if (resumeData.summary && resumeData.summary.length < 50) {
    score += 5;
    feedback.push({
      type: 'warning',
      category: 'Summary',
      message: 'Summary is too short'
    });
    suggestions.push('Expand your summary to 100-150 words highlighting key achievements');
  } else {
    feedback.push({
      type: 'error',
      category: 'Summary',
      message: 'No professional summary'
    });
    suggestions.push('Add a compelling professional summary (100-150 words)');
  }

  // Check work experience (30 points)
  if (resumeData.experience && resumeData.experience.length > 0) {
    score += 20;

    // Check for achievements and quantifiable results
    const hasQuantifiableResults = resumeData.experience.some(exp =>
      exp.achievements && exp.achievements.length > 0
    );

    if (hasQuantifiableResults) {
      score += 10;
      feedback.push({
        type: 'success',
        category: 'Experience',
        message: 'Experience includes quantifiable achievements'
      });
    } else {
      feedback.push({
        type: 'warning',
        category: 'Experience',
        message: 'Add quantifiable achievements to your experience'
      });
      suggestions.push('Use numbers and metrics: "Increased sales by 25%", "Managed team of 10"');
    }
  } else {
    feedback.push({
      type: 'error',
      category: 'Experience',
      message: 'No work experience listed'
    });
    suggestions.push('Add your work experience with achievements');
  }

  // Check education (15 points)
  if (resumeData.education && resumeData.education.length > 0) {
    score += 15;
    feedback.push({
      type: 'success',
      category: 'Education',
      message: 'Education history provided'
    });
  } else {
    feedback.push({
      type: 'error',
      category: 'Education',
      message: 'No education listed'
    });
    suggestions.push('Add your educational background');
  }

  // Check skills (20 points)
  if (resumeData.skills) {
    const totalSkills = [
      ...(resumeData.skills.technical || []),
      ...(resumeData.skills.languages || []),
      ...(resumeData.skills.frameworks || []),
      ...(resumeData.skills.tools || [])
    ].length;

    if (totalSkills >= 10) {
      score += 20;
      feedback.push({
        type: 'success',
        category: 'Skills',
        message: `Comprehensive skill set (${totalSkills} skills)`
      });
    } else if (totalSkills >= 5) {
      score += 10;
      feedback.push({
        type: 'warning',
        category: 'Skills',
        message: 'Add more relevant skills'
      });
      suggestions.push('List 10-15 relevant technical skills');
    } else {
      feedback.push({
        type: 'error',
        category: 'Skills',
        message: 'Very few skills listed'
      });
      suggestions.push('Add technical skills, tools, and frameworks you know');
    }
  }

  // Check projects (10 points)
  if (resumeData.projects && resumeData.projects.length >= 2) {
    score += 10;
    feedback.push({
      type: 'success',
      category: 'Projects',
      message: 'Projects showcase your work'
    });
  } else if (resumeData.projects && resumeData.projects.length === 1) {
    score += 5;
    feedback.push({
      type: 'warning',
      category: 'Projects',
      message: 'Add more projects'
    });
    suggestions.push('Showcase 2-3 significant projects with technologies used');
  } else {
    feedback.push({
      type: 'info',
      category: 'Projects',
      message: 'No projects listed'
    });
    suggestions.push('Add personal or professional projects to demonstrate skills');
  }

  // Check for ATS-friendly formatting (5 points)
  const atsKeywords = [
    'developed', 'managed', 'led', 'created', 'implemented',
    'improved', 'increased', 'reduced', 'achieved', 'delivered'
  ];

  const resumeText = JSON.stringify(resumeData).toLowerCase();
  const keywordCount = atsKeywords.filter(keyword => resumeText.includes(keyword)).length;

  if (keywordCount >= 5) {
    score += 5;
    feedback.push({
      type: 'success',
      category: 'ATS Keywords',
      message: 'Good use of action verbs'
    });
  } else {
    feedback.push({
      type: 'warning',
      category: 'ATS Keywords',
      message: 'Use more action verbs'
    });
    suggestions.push('Start bullet points with strong action verbs: Led, Developed, Improved, etc.');
  }

  // Generate ATS compatibility rating
  let rating = 'Poor';
  let ratingColor = '#ff3366';

  if (score >= 80) {
    rating = 'Excellent';
    ratingColor = '#00ff88';
  } else if (score >= 60) {
    rating = 'Good';
    ratingColor = '#00d9ff';
  } else if (score >= 40) {
    rating = 'Fair';
    ratingColor = '#ffaa00';
  }

  return {
    score,
    rating,
    ratingColor,
    feedback,
    suggestions,
    breakdown: {
      contactInfo: resumeData.personalInfo ? 10 : 0,
      summary: resumeData.summary ? (resumeData.summary.length >= 50 ? 10 : 5) : 0,
      experience: resumeData.experience?.length > 0 ? 20 : 0,
      education: resumeData.education?.length > 0 ? 15 : 0,
      skills: resumeData.skills ? 20 : 0,
      projects: resumeData.projects?.length >= 2 ? 10 : (resumeData.projects?.length === 1 ? 5 : 0),
      atsKeywords: keywordCount >= 5 ? 5 : 0
    }
  };
}

export function generateATSSuggestions(resumeData, targetRole = '') {
  const suggestions = [];

  // Role-specific keywords
  const roleKeywords = {
    'frontend': ['React', 'Vue', 'Angular', 'JavaScript', 'CSS', 'HTML', 'UI/UX'],
    'backend': ['Node.js', 'Python', 'Java', 'API', 'Database', 'MongoDB', 'SQL'],
    'fullstack': ['React', 'Node.js', 'MongoDB', 'REST API', 'Git', 'Agile'],
    'data': ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Data Analysis'],
    'devops': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Jenkins']
  };

  if (targetRole) {
    const roleKey = Object.keys(roleKeywords).find(key =>
      targetRole.toLowerCase().includes(key)
    );

    if (roleKey) {
      const keywords = roleKeywords[roleKey];
      const currentSkills = [
        ...(resumeData.skills?.technical || []),
        ...(resumeData.skills?.frameworks || []),
        ...(resumeData.skills?.tools || [])
      ].map(s => s.toLowerCase());

      const missingKeywords = keywords.filter(kw =>
        !currentSkills.some(skill => skill.toLowerCase().includes(kw.toLowerCase()))
      );

      if (missingKeywords.length > 0) {
        suggestions.push({
          type: 'keyword',
          title: `Add ${roleKey} role keywords`,
          keywords: missingKeywords,
          message: `Consider adding these keywords if applicable: ${missingKeywords.join(', ')}`
        });
      }
    }
  }

  return suggestions;
}
