// Navigation component

document.addEventListener('DOMContentLoaded', () => {
  // Load dynamic header
  loadComponent('header-placeholder', '../components/header.html')
    .then(() => {
      highlightActiveLink();
    });

  // Load dynamic footer
  loadComponent('footer-placeholder', '../components/footer.html');
});


function highlightActiveLink() {
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (!href) return;

    // Extract file names for comparison
    const currentPageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    const targetPageName = href.substring(href.lastIndexOf('/') + 1);

    // Standardize Home matching (handles index.html, landingPage.html, or root /)
    const isCurrentHome = currentPageName === '' || currentPageName === 'index.html' || currentPageName === 'landingPage.html';
    const isTargetHome = targetPageName === 'index.html' || targetPageName === 'landingPage.html';

    if ((isCurrentHome && isTargetHome) || currentPageName === targetPageName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Vision & Mission dynamic mobile card stack toggle
function selectCard(cardName) {
  const visionCard = document.getElementById('vision-card');
  const missionCard = document.getElementById('mission-card');
  if (!visionCard || !missionCard) return;

  if (cardName === 'vision') {
    visionCard.classList.remove('inactive');
    visionCard.classList.add('active');
    missionCard.classList.remove('active');
    missionCard.classList.add('inactive');
  } else if (cardName === 'mission') {
    missionCard.classList.remove('inactive');
    missionCard.classList.add('active');
    visionCard.classList.remove('active');
    visionCard.classList.add('inactive');
  }
}
window.selectCard = selectCard; // Expose globally for HTML onclick trigger

// Mobile Side-by-Side Drawer Logic
const mobileDeptData = {
  'software-web': { title: 'Software & Web Development', desc: 'Focuses on building technical proficiency in web and application development while enhancing coding skills through personal projects.', icon: '../assets/icons/SoftwareWeb.png' },
  'data-analytics': { title: 'Data Analytics', desc: 'Develops skills in complex data analysis to drive technological advancement and prepare members for data-driven industries.', icon: '../assets/icons/DataAnalytics.png' },
  'security': { title: 'Security', desc: 'Focuses on the critical field of cybersecurity, equipping members with the skills necessary to protect digital assets and implement security best practices.', icon: '../assets/icons/Security.png' },
  'cloud-computing': { title: 'Cloud Computing', desc: 'Masters cloud architecture and AWS services to prepare members for the digital economy through practical, real-world deployment.', icon: '../assets/icons/CloudComputing.png' },
  'ml-ai': { title: 'Machine Learning & AI', desc: 'Advances innovation in artificial intelligence and machine learning, encouraging members to conduct research and build real-world prototypes with AWS tools.', icon: '../assets/icons/MLAI.png' },
  'adv-infra': { title: 'Advanced Network & Infrastructure', desc: 'Strengthens understanding of modern networking systems and foundational infrastructure through technical assessments designed to build high-level engineering leaders.', icon: '../assets/icons/AdvInfra.png' }
};

const mobileOfficeData = {
  'Executive': 'The Executive Committee provides overall direction, coordination, and oversight for the organization. Due to limited availability of senior officers, executive roles are primarily supervisory, documentation-focused, and approval-based.',
  'Relations': 'Driving organizational growth and protecting its digital integrity by leading initiatives in resource acquisition, engaging content creation, strategic partnerships, professional correspondence, cybersecurity, and meticulous agreement alignment.',
  'Operations': 'Manages the Cloud Club\'s Operations and Events Office by directing strategic planning, resource allocation, event execution, quality assurance, risk mitigation, and team leadership to ensure seamless daily functioning and successful club experiences.',
  'Creatives': 'Driving its visual identity and audience engagement by managing visual content creation, media enhancement, project documentation, and impactful presentations.',
  'Marketing': 'Amplifying the organization\'s online influence and community engagement through social media management, strategic publication materials, brand protection, and proactive security measures.',
  'Finance': 'Safeguarding the organization\'s assets and ensuring university compliance by managing budgets, monitoring expenditures, and conducting financial forecasting to support strategic planning.',
  'Media': 'Handles event photography and videography, coordinate officer pictorials, and organize media files. By delivering high-quality visual assets, they provide essential support to the creatives and marketing teams for post-event publicity.',
  'Technology': 'Key tasks include managing the AWS Skill Builder Program, training officers, and facilitating hands-on technical seminars. The committee also provides event technical support, proposes future tech initiatives, and recruits volunteers to maintain the website.'
};

function slideDetailCard(cardId, titleId, descId, dataObj, newKey, clickedEl, iconId) {
  const container = clickedEl.closest('.master-list-container');
  const detailCard = document.getElementById(cardId);
  const titleEl = document.getElementById(titleId);
  const descEl = document.getElementById(descId);
  const iconEl = iconId ? document.getElementById(iconId) : null;
  
  if (!detailCard || !titleEl || !descEl) return;
  
  // Update active states
  container.querySelectorAll('.master-list-card').forEach(c => c.classList.remove('active'));
  clickedEl.classList.add('active');
  
  // 1. Slide up to exit and fade out
  detailCard.classList.add('sliding-up-out');
  
  // 2. Wait for exit animation to finish
  setTimeout(() => {
    // Temporarily disable transition and move card to the bottom
    detailCard.classList.add('no-transition');
    detailCard.classList.add('sliding-down-enter');
    detailCard.classList.remove('sliding-up-out');

    // Swap data
    if (dataObj[newKey]) {
      if (typeof dataObj[newKey] === 'string') {
        titleEl.textContent = newKey;
        descEl.textContent = dataObj[newKey];
      } else {
        titleEl.textContent = dataObj[newKey].title;
        descEl.textContent = dataObj[newKey].desc;
        if (iconEl && dataObj[newKey].icon) {
          iconEl.src = dataObj[newKey].icon;
        }
      }
    }

    // Force a browser reflow so it registers the jump to the bottom
    void detailCard.offsetHeight;

    // Remove classes to trigger the slide-up-from-bottom entrance animation
    detailCard.classList.remove('no-transition');
    detailCard.classList.remove('sliding-down-enter');
  }, 300); // Wait 300ms for exit animation to complete
}

function selectMobileDept(deptId) {
  slideDetailCard('mobile-dept-detail-card', 'mobile-dept-detail-title', 'mobile-dept-detail-desc', mobileDeptData, deptId, event.currentTarget, 'mobile-dept-detail-icon');
}
window.selectMobileDept = selectMobileDept;

function selectMobileOffice(officeId) {
  slideDetailCard('mobile-office-detail-card', 'mobile-office-detail-title', 'mobile-office-detail-desc', mobileOfficeData, officeId, event.currentTarget);
}
window.selectMobileOffice = selectMobileOffice;

// Goals card toggle expansion dynamic listener
document.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('goal-card-more-btn')) {
    const cardOuter = e.target.closest('.goal-card-outer');
    if (!cardOuter) return;
    
    const isExpanded = cardOuter.classList.contains('expanded');
    if (isExpanded) {
      cardOuter.classList.remove('expanded');
      e.target.textContent = 'more';
    } else {
      cardOuter.classList.add('expanded');
      e.target.textContent = 'less';
    }
  }
});

// About Page Hero Auto-Slideshow Carousel
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.about-hero-slideshow .slide');
  if (slides.length === 0) return;

  let currentSlideIndex = 0;
  setInterval(() => {
    slides[currentSlideIndex].classList.remove('active');
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    slides[currentSlideIndex].classList.add('active');
  }, 3000);
});