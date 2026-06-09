document.addEventListener('DOMContentLoaded', () => {
    function initCardQueue(containerSelector) {
        // Prevent this desktop logic from running on mobile screens
        if (window.innerWidth < 769) return;

        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        const isOffices = containerSelector.includes('offices');
        
        const cardElements = container.querySelectorAll('.skill-builder-cards, .offices-cards');
        if (cardElements.length === 0) return;
        
        const officesLongDesc = {
            'Executive': 'The Executive Committee provides overall direction, coordination, and oversight for the organization. Due to limited availability of senior officers, executive roles are primarily supervisory, documentation focused, and approval-based.',
            'Relations': 'Driving organizational growth and protecting its digital integrity by leading initiatives in resource acquisition, engaging external relations, strategic partnerships, professional correspondence, cybersecurity, and meticulous agreement alignment.',
            'Operations': "Manages the Cloud Club's operations and events office by directing strategic planning, resource allocation, event execution, quality assurance, risk mitigation, and team leadership to ensure seamless daily functioning and successful club experiences.",
            'Creatives': 'Driving its visual identity and audience engagement by managing visual content creation, media enhancement, project documentation, and impactful presentations.',
            'Marketing': "Amplifying the organization's online influence and community engagement through social media management, strategic publications materials, brand protection, and proactive security measures.",
            'Finance': "Safeguarding the organization's assets and ensuring university compliance by managing budgets, monitoring expenditures, and conducting financial forecasting to support strategic planning.",
            'Media': 'Handles event photography and videography, coordinates offline polyworks, and organize media files. By delivering high-quality visual assets, they provide essential support to the creative and marketing teams for post-event publicity.',
            'Technology': 'Key tasks include managing the AWS Skill Builder Program, training officers, and facilitating hands-on technical seminars. The committee also provides event technical support, proposes future tech initiatives, and recruits volunteers to maintain the website.'
        };

        const departmentsLongDesc = {
            'Software & Web Development': 'This specialization focuses on building technical proficiency in creating applications and websites. Members in this area work on enhancing their coding skills and potentially showcasing personal projects to further their development in the field.',
            'Data Analytics': 'This section is dedicated to fostering expertise in interpreting complex data to drive technological advancement. Members and Skill-Builder Scholars engage in activities that prepare them for professional growth in data-driven environments.',
            'Security': 'Focused on the critical field of cybersecurity, this department provides members with the skills necessary to protect digital assets. Leadership within this area is selected based on technical assessments and certifications, ensuring that members are guided by individuals with proven knowledge in security best practices.',
            'Cloud Computing': 'As a core pillar of the AWS Learning Club, this specialization aims to prepare students for the digital economy by mastering cloud architecture and AWS services. Members participate in hands-on workshops and training sessions to gain practical experience in deploying and managing cloud solutions.',
            'Machine Learning & AI': 'This department focuses on the cutting-edge fields of artificial intelligence and machine learning to drive innovation. Members explore how to apply these technologies to solve real-world problems and are encouraged to conduct research and develop prototypes using AWS tools.',
            'Advanced Network & Infrastructure': 'This specialization focuses on the complex systems that support modern technology, including networking and foundational infrastructure. Aspiring leaders in this department undergo rigorous technical assessments to ensure they can effectively guide members in mastering high-level infrastructure concepts.'
        };

        const officesIcons = {
            'Executive': '../assets/about/departments-offices/Exec.png',
            'Relations': '../assets/about/departments-offices/Relations.png',
            'Operations': '../assets/about/departments-offices/Operations.png',
            'Creatives': '../assets/about/departments-offices/Creatives.png',
            'Marketing': '../assets/about/departments-offices/Marketing.png',
            'Finance': '../assets/about/departments-offices/Finance.png',
            'Media': '../assets/about/departments-offices/Mediaa.png',
            'Technology': '../assets/about/departments-offices/Technology.png'
        };

        const departmentsIcons = {
            'Software & Web Development': '../assets/about/departments-offices/SoftwareWeb.png',
            'Data Analytics': '../assets/about/departments-offices/DataAnalytics.png',
            'Security': '../assets/about/departments-offices/Security.png',
            'Cloud Computing': '../assets/about/departments-offices/CloudComputing.png',
            'Machine Learning & AI': '../assets/about/departments-offices/MLAI.png',
            'Advanced Network & Infrastructure': '../assets/about/departments-offices/AdvInfra.png'
        };

        const cardsData = Array.from(cardElements).map((card, index) => {
            const title = card.querySelector('h2').innerText;
            const longDescMap = isOffices ? officesLongDesc : departmentsLongDesc;
            const iconMap = isOffices ? officesIcons : departmentsIcons;
            return {
                id: index,
                title: title,
                desc: card.querySelector('p').innerHTML,
                longDesc: longDescMap[title] || card.querySelector('p').innerHTML,
                icon: iconMap[title] || (isOffices ? '../assets/about/departments-offices/office-icon.png' : '../assets/about/departments-offices/dept-icon.png')
            };
        });

        const desktopCardsContainer = container.querySelector('.skill-builder-cards-container, .offices-cards-container');
        if (desktopCardsContainer) {
            desktopCardsContainer.style.display = 'none';
        }

        const queueArea = document.createElement('div');
        queueArea.className = 'queue-area desktop-only-flex';
        
        const spotlightArea = document.createElement('div');
        spotlightArea.className = 'spotlight-area desktop-only-flex';
        
        const mobileDrawer = container.querySelector('.mobile-only');
        if (mobileDrawer) {
            container.insertBefore(queueArea, mobileDrawer);
            container.insertBefore(spotlightArea, mobileDrawer);
        } else {
            container.appendChild(queueArea);
            container.appendChild(spotlightArea);
        }
        
        function createSpotlightCard(card) {
            const el = document.createElement('div');
            el.className = 'spotlight-card';
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
            
            el.innerHTML = `
                <div style="position: absolute; width: 44px; height: 44px; left: 20px; top: 29px; background: #FFF; box-shadow: 0px 4px 4px ${isOffices ? 'rgba(255, 111, 8, 0.25)' : 'rgba(28, 52, 102, 0.4)'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; box-sizing: border-box;">
                    <img src="${card.icon}" alt="${card.title} Icon" style="width: 100%; height: 100%; object-fit: contain; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;">
                </div>
                <h2 class="spotlight-title" style="margin: 0 0 0 auto; padding-top: 10px; padding-bottom: 8px; font-family: 'Poppins', sans-serif; font-weight: 700; font-size: ${isOffices ? '34px' : '27px'}; line-height: ${isOffices ? '40px' : '30px'}; text-align: right; background: linear-gradient(180deg, ${isOffices ? '#FAFE00 0%, #F6BE16 22.12%, #F27E2C 100%' : '#4363A6 0%, #1C3466 100%'}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; width: 224px; min-height: 68px; display: block; letter-spacing: -0.02em;">${card.title}</h2>
                <div class="spotlight-card-inner">
                    <p class="spotlight-desc" style="font-family: 'Poppins', sans-serif; font-weight: 500; font-size: 13.5px; line-height: 145%; color: ${isOffices ? '#C45506' : '#161B3C'}; margin: 0;">${card.longDesc}</p>
                </div>
            `;
            return el;
        }

        let activeCardIndex = 0; 
        let queueCardsNodes = [];

        function initQueue() {
            queueArea.innerHTML = '';
            queueCardsNodes = [];
            
            cardsData.forEach((card, index) => {
                const qCard = document.createElement('div');
                qCard.className = 'queue-card';
                const spacing = isOffices ? 115 : 160;
                const leftPos = index * spacing;
                qCard.style.setProperty('--left-pos', `${leftPos}px`);
                qCard.style.setProperty('--up-pos', `0px`);
                qCard.style.transform = `translateX(var(--left-pos)) translateY(var(--up-pos)) matrix(0.87, 0.5, 0, 1, 0, 0)`;
                qCard.style.zIndex = 100 - index;
                
                qCard.innerHTML = `
                    <div class="queue-card-inner" style="align-items: flex-start; text-align: left;">
                        <h2 class="queue-card-title" style="font-size: ${isOffices ? '30px' : '20px'}; font-family: 'Poppins', sans-serif; font-weight: 700; margin-bottom: 8px; line-height: ${isOffices ? '34px' : '30px'}; width: 100%; text-align: left;">${card.title}</h2>
                        <p style="color: ${isOffices ? '#123A90' : '#fff'}; font-size: 13px; font-family: 'Poppins', sans-serif; font-weight: 500; margin-top: auto; line-height: 20px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; width: 100%; text-align: left;">${card.desc}</p>
                    </div>
                `;
                
                qCard.addEventListener('click', () => {
                    if(activeCardIndex !== card.id) {
                        setActiveCard(card.id);
                    }
                });
                
                queueArea.appendChild(qCard);
                queueCardsNodes.push(qCard);
            });
        }

        function setActiveCard(id) {
            activeCardIndex = id;
            
            // Update queue styling
            queueCardsNodes.forEach((node, idx) => {
                const titleEl = node.querySelector('.queue-card-title');
                if(idx === activeCardIndex) {
                    node.style.background = isOffices ? 'rgba(255, 183, 0, 0.65)' : 'rgba(22, 27, 60, 0.65)';
                    node.style.setProperty('--up-pos', '-15px');
                    titleEl.style.color = isOffices ? '#123A90' : '#FFFFFF';
                } else {
                    node.style.background = 'rgba(255, 255, 255, 0.5)';
                    node.style.setProperty('--up-pos', '0px');
                    titleEl.style.color = '#123A90';
                }
            });
            
            const newCardData = cardsData.find(c => c.id === id);
            const newCardEl = createSpotlightCard(newCardData);
            
            const oldCards = spotlightArea.querySelectorAll('.spotlight-card');
            spotlightArea.appendChild(newCardEl);
            
            // Force reflow
            void newCardEl.offsetWidth;
            
            // Animate new card IN
            newCardEl.style.opacity = '1';
            newCardEl.style.transform = 'translateY(0)';
            
            // Animate old cards OUT
            oldCards.forEach(old => {
                old.style.opacity = '0';
                old.style.transform = 'translateY(-40px)';
                setTimeout(() => {
                    old.remove();
                }, 600);
            });
        }

        initQueue();
        setActiveCard(0);
    }

    initCardQueue('.skill-builder-container');
    initCardQueue('.offices-container');
});
