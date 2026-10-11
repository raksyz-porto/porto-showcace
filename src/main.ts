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
    <div class="nav-left" style="display:none;">
      <a href="/" class="logo">
        <svg data-name="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
          <path d="M24 8c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16S32.8 8 24 8zm0 28c-6.6 0-12-5.4-12-12S17.4 12 24 12s12 5.4 12 12-5.4 12-12 12z" fill="currentColor"/>
        </svg>
      </a>
      <h5 class="full-identity" style="display:none;">
        <span class="nickname">raksyz</span>/<span class="fullname">raka</span>
      </h5>
    </div>
    <div class="nav-right" style="display:none;">
      <ul class="nav-links">
        <li><a href="#hero">Home</a></li>
        <li><a href="#projects">Work</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
  `
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
        <span class="line-1">HEY, I'M RAKA</span>
        <span class="line-2">BUT YOU CAN CALL ME RAKSYZ</span>
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
    <h2 class="section-title">WORK</h2>
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
    <h2 class="section-title">ABOUT</h2>
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

// Contact section
function createContact() {
  const section = document.createElement('section')
  section.id = 'contact'
  section.className = 'reveal'
  section.innerHTML = `
    <h2 class="section-title">CONTACT</h2>
    <div class="contact-content">
      <p class="contact-text">
        I'm currently available for freelance work and full-time opportunities.
        Let's build something awesome together!
      </p>
      <div class="social-links">
        <a href="https://github.com/raksyz-dev" target="_blank" class="social-link">
          <i class="fab fa-github"></i> GitHub
        </a>
        <a href="https://linkedin.com/in/raksyz" target="_blank" class="social-link">
          <i class="fab fa-linkedin"></i> LinkedIn
        </a>
        <a href="https://twitter.com/rkanovian" target="_blank" class="social-link">
          <i class="fab fa-twitter"></i> Twitter
        </a>
        <a href="mailto:hello@raksyz.dev" class="social-link">
          <i class="fas fa-envelope"></i> Email
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
    document.getElementById('projects-grid')!.innerHTML = '<p>Supabase not configured</p>'
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
    document.getElementById('projects-grid')!.innerHTML = '<p>Failed to load projects</p>'
  }
}

// Render projects
function renderProjects() {
  const grid = document.getElementById('projects-grid')
  if (!grid || allProjects.length === 0) {
    grid!.innerHTML = '<p class="no-projects">No projects yet</p>'
    return
  }
  
  grid.innerHTML = allProjects
    .map((project) => `
      <div class="project-card reveal">
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
  
  // Nav show after splash
  setTimeout(() => {
    const navLeft = document.querySelector('.nav-left')
    const navRight = document.querySelector('.nav-right')
    if (navLeft) (navLeft as HTMLElement).style.display = 'block'
    if (navRight) (navRight as HTMLElement).style.display = 'block'
  }, 800)
  
  // Load projects
  if (dbClient) {
    fetchProjects()
    checkAdminSession()
  }
}

init()
