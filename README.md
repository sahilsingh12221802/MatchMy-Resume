# MatchMyResume 
AI-Powered Resume Matching with End-to-End DevOps Automation

## Project Overview
MatchMyResume is an AI-powered web application that analyzes a user’s resume against a given job description to generate a match percentage, ATS compatibility score, missing keywords, and actionable improvement suggestions. The project combines modern frontend development with a complete DevOps pipeline for automated infrastructure provisioning, deployment, and monitoring.

This project demonstrates real-world implementation of **Web Development + DevOps practices** using cloud and automation tools.

---

## Features
- Upload resume in PDF format
- Paste job description for comparison
- AI-based resume vs JD analysis using Google Gemini
- Match percentage and detailed score breakdown
- ATS compatibility score
- Missing keyword detection
- Strengths, weaknesses, and improvement suggestions
- Responsive and user-friendly UI

---

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Dropzone
- PDF.js
- Google Generative AI (Gemini)

### DevOps & Cloud
- AWS EC2
- Terraform (Infrastructure as Code)
- Puppet (Configuration Management)
- Ansible (Automated Deployment)
- Nagios (Monitoring)
- Nginx (Web Server)

---


## DevOps Implementation

### 1️⃣ Terraform – Infrastructure Provisioning
- Provisions an AWS EC2 instance automatically
- Installs and starts Nginx using user data
- Outputs public IP of the instance

<img width="442" height="520" alt="image" src="https://github.com/user-attachments/assets/558192fd-031c-4e00-abbc-8788c1cfa8b2" />


### 2️⃣ Puppet – Configuration Management
- Installs required packages (Node.js, npm, Git, Nginx)
- Clones the GitHub repository
- Installs project dependencies
- Ensures Nginx service is running

<img width="440" height="520" alt="image" src="https://github.com/user-attachments/assets/172214d9-ea2c-4e60-88ad-366c31b8c24d" />


### 3️⃣ Ansible – Automated Deployment
- Deploys the application with a single playbook
- Installs dependencies
- Builds the React application
- Copies build files to Nginx web root
- Restarts Nginx service

<img width="427" height="520" alt="image" src="https://github.com/user-attachments/assets/57fcdcb5-08ba-4167-b689-e83c3e38fe77" />


### 4️⃣ Nagios – Continuous Monitoring
- Monitors server availability
- Tracks HTTP service status
- Checks CPU load and disk usage
- Provides real-time monitoring dashboard

<img width="482" height="520" alt="image" src="https://github.com/user-attachments/assets/bacb7e21-f9bf-4e29-a701-5416e57becdb" />


---

## Getting Started (Local Setup)

### Prerequisites
- Node.js
- npm

### Installation
```bash
git clone https://github.com/sahilsingh12221802/MatchMy-Resume.git
cd MatchMy-Resume
npm install
```

### Run Locally
```bash
npm run dev
```
---

## Deployment

- The application is deployed on an AWS EC2 instance using:
- Terraform for infrastructure provisioning
- Puppet for server configuration
- Ansible for application deployment
- Nagios for monitoring

---

## Monitoring

**Nagios monitors:-**
- Ping (Server Availability) 
- HTTP Service
- CPU Load
- Disk Usage


<i>If you find this project useful, feel free to star the repository!</i>
