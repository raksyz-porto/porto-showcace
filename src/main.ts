// Minimalist portfolio - itssharl.ee style replika
// Clean, brutalist, content-first

import './style.css'

// Supabase config
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

interface Project {
  id: string
  title: string
  description: string
  image: string
  demo_link: string
  github_link: string
  technologies: string
  category?: string
}

let dbClient: any = null
let allProjects: Project[] = []

// Dummy projects for demo (fallback if Supabase not configured)
const DUMMY_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Portal Warga Kelurahan (E-GOV V5)',
    description: 'Government public service portal with 768K+ residents, real-time announcements, and digital document processing',
    image: 'https://placehold.co/600x400/1a1a2e/eee?text=E-GOV+V5',
    demo_link: 'https://e-gov-v5.vercel.app/',
    github_link: 'https://github.com/raksyz-porto',
    technologies: 'Next.js,React,Supabase'
  },
  {
    id: '2',
    title: 'RAKSYZ SIMPLE PORTFOLIO',
    description: 'Clean minimalist portfolio with smooth animations and Supabase CMS integration',
    image: 'https://placehold.co/600x400/606887/fff?text=SIMPLE+PORTFOLIO',
    demo_link: '#',
    github_link: 'https://github.com/raksyz-dev',
    technologies: 'Vite,TypeScript,CSS'
  },
  {
    id: '3',
    title: 'MODERN PORTFOLIO SHOWCASE',
    description: 'Full-featured portfolio with admin panel, image upload, and real-time sync',
    image: 'https://placehold.co/600x400/2e7d32/fff?text=MODERN+SHOWCASE',
    demo_link: 'https://www.raksyz.bond/',
    github_link: 'https://github.com/raksyz-porto/portfolio-dev',
    technologies: 'Next.js,Supabase,Auth'
  },
  {
    id: '4',
    title: 'Luxury Store',
    description: 'Premium e-commerce platform with elegant design and seamless checkout experience',
    image: 'https://placehold.co/600x400/1a1a1a/d4af37?text=LUXURY+STORE',
    demo_link: '#',
    github_link: '#',
    technologies: 'React,Stripe,Tailwind'
  },
  {
    id: '5',
    title: 'Fintech App',
    description: 'Mobile-first financial dashboard with real-time transactions and analytics',
    image: 'https://placehold.co/600x400/0d47a1/fff?text=FINTECH+APP',
    demo_link: '#',
    github_link: '#',
    technologies: 'React Native,Node.js'
  },
  {
    id: '6',
    title: 'AI Generator',
    description: 'AI-powered content generation tool with modern interface and fast processing',
    image: 'https://placehold.co/600x400/6a1b9a/fff?text=AI+GENERATOR',
    demo_link: '#',
    github_link: '#',
    technologies: 'Python,React,API'
  }
]

// Init Supabase
async function initSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('[Supabase] Missing credentials')
    return
  }
  const { createClient } = await import('@supabase/supabase-js')
  dbClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

// Splashscreen
function showSplashscreen() {
  const splash = document.createElement('div')
  splash.className = 'splashscreen'
  splash.innerHTML = `
    <div class="logo-animation">
      <svg data-name="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="72" height="72">
        <circle cx="36" cy="36" r="32" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
        <circle cx="36" cy="36" r="24" fill="none" stroke="currentColor" stroke-width="2" opacity="0.5"/>
        <circle cx="36" cy="36" r="16" fill="currentColor"/>
      </svg>
    </div>
    <p class="loading-text">Materializing shapes...</p>
    <div class="credits">
      <p>Designed and coded by Raksyz © 2026</p>
    </div>
  `
  document.body.appendChild(splash)
  
  setTimeout(() => {
    splash.style.opacity = '0'
    setTimeout(() => splash.remove(), 600)
  }, 1500)
}

// Navigation
function createNav() {
  const nav = document.createElement('nav')
  nav.innerHTML = `
    <div class="nav-left">
      <a href="/" class="logo">
        <svg data-name="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
          <path d="M24 8c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16S32.8 8 24 8zm0 28c-6.6 0-12-5.4-12-12S17.4 12 24 12s12 5.4 12 12-5.4 12-12 12z" fill="currentColor"/>
        </svg>
      </a>
      <h5 class="full-identity">
        <span class="nickname">raksyz</span>/<span class="fullname">raka</span>
      </h5>
    </div>
    <button class="hamburger" aria-label="Toggle menu" aria-expanded="false">☰</button>
    <div class="nav-right">
      <ul class="nav-links">
        <li><a href="#hero">Home</a></li>
        <li><a href="#projects">Work</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#education">Education</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
  `
  // Hamburger toggle
  const hamburger = nav.querySelector('.hamburger') as HTMLElement
  const navLinks = nav.querySelector('.nav-links') as HTMLElement
  hamburger?.addEventListener('click', () => {
    const isActive = navLinks.classList.toggle('active')
    hamburger.setAttribute('aria-expanded', String(isActive))
    hamburger.textContent = isActive ? '✕' : '☰'
  })
  // Close menu on link click (mobile)
  nav.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active')
      hamburger.textContent = '☰'
      hamburger.setAttribute('aria-expanded', 'false')
    })
  })
  return nav
}

// Hero section
function createHero() {
  const hero = document.createElement('section')
  hero.id = 'hero'
  hero.className = 'reveal'
  hero.innerHTML = `
    <div class="hero-content">
      <h1 class="hero-title">
        <span class="line-1">Hey, I'm Raka</span>
        <span class="line-2">you can Call me <em>Raksyz</em></span>
      </h1>
      <p class="hero-subtitle">
        I'm a full stack web developer<br/>
        & front-end enthusiast from Indonesia
      </p>
      <div class="hero-cta">
        <a href="#projects" class="cta-link">→ see my projects</a>
        <a href="#about" class="cta-link">→ more about me</a>
      </div>
    </div>
  `
  return hero
}

// Projects section
function createProjects() {
  const section = document.createElement('section')
  section.id = 'projects'
  section.className = 'reveal'
  section.innerHTML = `
    <h2 class="section-title">Work</h2>
    <div class="projects-loader">
      <i class="fas fa-spinner fa-spin"></i> Loading projects...
    </div>
    <div class="projects-grid" id="projects-grid"></div>
  `
  return section
}

// About section
function createAbout() {
  const section = document.createElement('section')
  section.id = 'about'
  section.className = 'reveal'
  section.innerHTML = `
    <h2 class="section-title">About</h2>
    <div class="about-content">
      <div class="about-image">
        <img src="/avatar.jpg" alt="Raksyz avatar" class="avatar"/>
      </div>
      <div class="about-text">
        <p class="about-intro">
          Hello! I'm Raka, a passionate full stack developer with experience building 
          scalable, modern web applications. I specialize in React, Next.js, Node.js, 
          and Supabase. I love turning complex problems into clean, intuitive interfaces.
        </p>
        <div class="skills-list">
          <span class="skill-item">React</span>
          <span class="skill-item">Next.js</span>
          <span class="skill-item">TypeScript</span>
          <span class="skill-item">Node.js</span>
          <span class="skill-item">Supabase</span>
          <span class="skill-item">TailwindCSS</span>
          <span class="skill-item">PostgreSQL</span>
          <span class="skill-item">Docker</span>
        </div>
      </div>
    </div>
  `
  return section
}

// Education data
const EDUCATION_DATA = [
  {
    degree: 'Bachelor of Computer Science',
    school: 'University of Technology Indonesia',
    year: '2020 - 2024',
    description: 'Focus on Software Engineering and Web Technologies. GPA: 3.8/4.0',
    icon: '🎓'
  },
  {
    degree: 'Full Stack Web Development Certification',
    school: 'Dicoding Indonesia',
    year: '2023',
    description: 'Specialized in React, Node.js, and Cloud Architecture',
    icon: '📜'
  },
  {
    degree: 'Front-End Development Bootcamp',
    school: 'Hacktiv8',
    year: '2022',
    description: 'Intensive 12-week program on modern JavaScript frameworks',
    icon: '💻'
  }
]

// Education section
function createEducation() {
  const section = document.createElement('section')
  section.id = 'education'
  section.className = 'reveal'
  section.innerHTML = `
    <h2 class="section-title">Education</h2>
    <div class="education-timeline">
      ${EDUCATION_DATA.map((edu, index) => `
        <div class="education-card ${index % 2 === 0 ? 'left' : 'right'}">
          <div class="education-icon">${edu.icon}</div>
          <div class="education-content">
            <div class="education-year">${edu.year}</div>
            <h3 class="education-degree">${edu.degree}</h3>
            <p class="education-school">${edu.school}</p>
            <p class="education-desc">${edu.description}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `
  return section
}

// Contact section
function createContact() {
  const section = document.createElement('section')
  section.id = 'contact'
  section.className = 'reveal'
  section.innerHTML = `
    <div class="contact-content">
      <h2 class="section-title">Start a Project</h2>
      <p class="contact-subtitle">Let's Talk</p>
      <a href="mailto:raka@raksyz.dev" class="contact-email">raka@raksyz.dev</a>
      <form class="contact-form" id="contact-form">
        <div class="form-row">
          <div class="form-group">
            <label for="name">Your Name</label>
            <input type="text" id="name" name="name" required placeholder="Your Name">
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" required placeholder="Email Address">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group message-group">
            <label for="message">Tell me about your project...</label>
            <textarea id="message" name="message" rows="5" required placeholder="Tell me about your project..."></textarea>
          </div>
          <div class="brand-placeholder">
            <div class="contact-brand">
              <img src="/logo-brand.jpg" alt="Raksyz Brand" class="brand-logo">
            </div>
          </div>
        </div>
        <button type="submit" class="btn-submit">Send Message</button>
      </form>
      <div class="social-links">
        <a href="https://github.com/raksyz-dev" target="_blank" class="social-link" aria-label="GitHub">
          <i class="fab fa-github"></i>
        </a>
        <a href="https://linkedin.com/in/raksyz" target="_blank" class="social-link" aria-label="LinkedIn">
          <i class="fab fa-linkedin"></i>
        </a>
        <a href="https://twitter.com/rkanovian" target="_blank" class="social-link" aria-label="Twitter">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="mailto:raka@raksyz.dev" class="social-link" aria-label="Email">
          <i class="fas fa-envelope"></i>
        </a>
      </div>
    </div>
  `
  return section
}

// Footer
function createFooter() {
  const footer = document.createElement('footer')
  footer.innerHTML = `
    <p>Designed and coded by Raksyz © 2026</p>
    <i class="fas fa-lock admin-trigger" id="open-admin-login" title="Admin Login"></i>
  `
  return footer
}

// Fetch projects from Supabase
async function fetchProjects() {
  if (!dbClient) {
    renderProjects() // Fallback to dummy projects
    return
  }
  
  try {
    const { data, error } = await dbClient
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    allProjects = data || []
    renderProjects()
  } catch (err) {
    console.error('Error fetching projects:', err)
    renderProjects() // Fallback to dummy on error
  }
}

// Render projects
function renderProjects() {
  const grid = document.getElementById('projects-grid')
  if (!grid) return
  
  const projects = allProjects.length > 0 ? allProjects : DUMMY_PROJECTS
  
  if (projects.length === 0) {
    grid.innerHTML = '<p class="no-projects">No projects yet</p>'
    return
  }
  
  grid.innerHTML = projects
    .map((project, index) => `
      <div class="project-card reveal" data-project-index="${index}" style="cursor: pointer;">
        <img src="${project.image}" alt="${project.title}" loading="lazy"/>
        <div class="project-info">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-tags">
            ${(project.technologies || '').split(',').map(t => `<span>${t.trim()}</span>`).join('')}
          </div>
          <div class="project-links">
            <a href="${project.demo_link}" target="_blank" class="btn-outline">Demo</a>
            <a href="${project.github_link}" target="_blank" class="btn">Code</a>
          </div>
        </div>
      </div>
    `)
    .join('')
  
  // Add click handlers for modal
  grid.querySelectorAll('.project-card').forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A') return // Don't open modal if clicking links
      openProjectModal(projects[idx])
    })
  })
}

// Open project modal
function openProjectModal(project: Project) {
  const existingModal = document.getElementById('project-modal')
  if (existingModal) existingModal.remove()
  
  const modal = document.createElement('div')
  modal.id = 'project-modal'
  modal.className = 'modal-overlay'
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" aria-label="Close modal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="modal-image">
        <img src="${project.image}" alt="${project.title}"/>
      </div>
      <div class="modal-body">
        <h2>${project.title}</h2>
        <p class="modal-description">${project.description}</p>
        <div class="modal-tags">
          ${(project.technologies || '').split(',').map(t => `<span>${t.trim()}</span>`).join('')}
        </div>
        <div class="modal-links">
          <a href="${project.demo_link}" target="_blank" class="btn-outline">Live Demo</a>
          <a href="${project.github_link}" target="_blank" class="btn">View Code</a>
        </div>
      </div>
    </div>
  `
  
  document.body.appendChild(modal)
  
  // Close handlers
  const closeBtn = modal.querySelector('.modal-close')
  const closeOnOverlay = (e: MouseEvent) => {
    if (e.target === modal) closeModal()
  }
  
  const closeModal = () => {
    modal.style.opacity = '0'
    setTimeout(() => {
      modal.remove()
      document.body.style.overflow = ''
    }, 300)
  }
  
  closeBtn?.addEventListener('click', closeModal)
  modal.addEventListener('click', closeOnOverlay)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal()
  })
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden'
  
  // Animate in
  requestAnimationFrame(() => {
    modal.style.opacity = '1'
    modal.querySelector('.modal-content')?.classList.add('visible')
  })
}

// Check admin session (placeholder for future auth UI)
async function checkAdminSession() {
  if (!dbClient) return
  console.log('Admin session check available')
}

// Init
async function init() {
  await initSupabase()
  showSplashscreen()
  
  const app = document.getElementById('app')
  if (!app) return
  
  app.appendChild(createNav())
  app.appendChild(createHero())
  app.appendChild(createProjects())
  app.appendChild(createAbout())
  app.appendChild(createEducation())
  app.appendChild(createContact())
  app.appendChild(createFooter())
  
  // Reveal on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    { threshold: 0.1 }
  )
  
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
  }, 500)
  
  // Load projects
  fetchProjects()
  checkAdminSession()
  
  // Contact form handler
  const contactForm = document.getElementById('contact-form') as HTMLFormElement
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(contactForm)
    const name = formData.get('name')
    const message = formData.get('message')
    
    // Mailto fallback
    const mailtoLink = `mailto:raka@raksyz.dev?subject=Project Inquiry from ${encodeURIComponent(String(name))}&body=${encodeURIComponent(String(message))}`
    window.location.href = mailtoLink
    
    // Reset form
    contactForm.reset()
    
    // Show success feedback
    const submitBtn = contactForm.querySelector('.btn-submit') as HTMLButtonElement
    const originalText = submitBtn.textContent
    submitBtn.textContent = 'Message Sent! ✓'
    submitBtn.style.background = 'var(--accent)'
    setTimeout(() => {
      submitBtn.textContent = originalText
      submitBtn.style.background = ''
    }, 3000)
  })
}

init()
