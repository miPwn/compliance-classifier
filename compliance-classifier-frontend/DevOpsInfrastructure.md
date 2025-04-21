# Compliance Classifier Frontend - DevOps Infrastructure Documentation

## Table of Contents

1. [Overview](#overview)
2. [Deployment Infrastructure](#deployment-infrastructure)
   - [Docker Configuration](#docker-configuration)
   - [Kubernetes Manifests](#kubernetes-manifests)
   - [Nginx Configuration](#nginx-configuration)
   - [SSL/TLS Configuration](#ssltls-configuration)
3. [CI/CD Pipeline](#cicd-pipeline)
   - [GitHub Actions Workflow](#github-actions-workflow)
   - [Environment Configuration](#environment-configuration)
   - [Automated Rollback](#automated-rollback)
   - [Branch Protection](#branch-protection)
4. [Monitoring and Observability](#monitoring-and-observability)
   - [Prometheus Configuration](#prometheus-configuration)
   - [Grafana Dashboards](#grafana-dashboards)
   - [ELK Stack](#elk-stack)
   - [Health Checks](#health-checks)
5. [Security Infrastructure](#security-infrastructure)
   - [Web Application Firewall](#web-application-firewall)
   - [Security Scanning](#security-scanning)
   - [Rate Limiting](#rate-limiting)
   - [Network Policies](#network-policies)
6. [Backup and Disaster Recovery](#backup-and-disaster-recovery)
   - [Backup Strategy](#backup-strategy)
   - [Disaster Recovery Plan](#disaster-recovery-plan)
   - [Multi-Region Deployment](#multi-region-deployment)
7. [Operational Procedures](#operational-procedures)
   - [Deployment](#deployment)
   - [Rollback](#rollback)
   - [Scaling](#scaling)
   - [Troubleshooting](#troubleshooting)

## Overview

This document provides comprehensive documentation for the DevOps infrastructure of the Compliance Classifier Frontend application. The infrastructure is designed to be robust, scalable, and secure, with automated deployment, monitoring, and disaster recovery capabilities.

## Deployment Infrastructure

### Docker Configuration

The application is containerized using Docker, with a multi-stage build process to optimize the image size and security.

**Key Files:**
- `Dockerfile`: Defines the multi-stage build process for the Angular application
- `docker-compose.yml`: Local development environment configuration
- `docker-compose.prod.yml`: Production environment configuration with Traefik, SSL, and monitoring

**Build Process:**
1. Build stage: Uses Node.js to build the Angular application
2. Production stage: Uses Nginx to serve the static assets

**Usage:**
```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Manifests

The application is deployed to Kubernetes using Kustomize for environment-specific configurations.

**Directory Structure:**
```
k8s/
├── base/                 # Base configuration
│   ├── namespace.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── frontend-configmap.yaml
│   ├── frontend-ingress.yaml
│   └── kustomization.yaml
└── overlays/             # Environment-specific overlays
    ├── staging/
    │   ├── kustomization.yaml
    │   └── patches/
    │       ├── frontend-deployment.yaml
    │       ├── frontend-configmap.yaml
    │       └── frontend-ingress.yaml
    └── production/
        ├── kustomization.yaml
        └── patches/
            ├── frontend-deployment.yaml
            ├── frontend-configmap.yaml
            └── frontend-ingress.yaml
```

**Deployment:**
```bash
# Staging
kubectl apply -k k8s/overlays/staging

# Production
kubectl apply -k k8s/overlays/production
```

### Nginx Configuration

Nginx is used as a reverse proxy and for serving static assets. The configuration includes:

- Compression settings for improved performance
- Security headers for enhanced security
- Cache control for static assets
- API proxy configuration
- Angular routing support

**Key Files:**
- `nginx/nginx.conf`: Nginx configuration for the Docker container

### SSL/TLS Configuration

SSL/TLS is configured using Let's Encrypt certificates managed by Traefik in the Docker Compose setup and by cert-manager in the Kubernetes setup.

**Docker Compose (Traefik):**
- Automatic certificate generation and renewal
- HTTP to HTTPS redirection
- HSTS configuration

**Kubernetes (cert-manager):**
- Automatic certificate generation and renewal via annotations
- TLS configuration in the Ingress resource

## CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline is implemented using GitHub Actions, with separate workflows for different environments.

**Key Files:**
- `.github/workflows/ci-cd.yml`: Main CI/CD workflow
- `.github/workflows/branch-protection.yml`: Branch protection rules

**Pipeline Stages:**
1. **Build and Test**: Builds the application and runs unit tests
2. **Security Scan**: Performs security scanning of dependencies
3. **E2E Tests**: Runs end-to-end tests
4. **Build Docker Image**: Builds and pushes the Docker image
5. **Deploy to Staging**: Deploys to the staging environment (for develop branch)
6. **Deploy to Production**: Deploys to the production environment (for main branch)
7. **Rollback on Failure**: Automatically rolls back if deployment fails

### Environment Configuration

Environment-specific configurations are managed using:

- Environment variables in GitHub Actions
- Kustomize overlays for Kubernetes
- Environment-specific Docker Compose files

**Environment Variables:**
- Stored as GitHub Secrets
- Referenced in workflows and deployment configurations

### Automated Rollback

Automated rollback is implemented in case of deployment failures:

- In Kubernetes, using `kubectl rollout undo`
- In Docker Compose, by redeploying the previous version

**Rollback Process:**
1. Detect deployment failure
2. Execute rollback command
3. Verify rollback success
4. Send notification

### Branch Protection

Branch protection rules are implemented to ensure code quality and security:

- Required status checks before merging
- Required code reviews
- Restrictions on force pushing and deletion

## Monitoring and Observability

### Prometheus Configuration

Prometheus is used for metrics collection and monitoring.

**Key Files:**
- `monitoring/prometheus/prometheus.yml`: Prometheus configuration

**Metrics Collected:**
- Application metrics
- System metrics
- Nginx metrics
- API metrics

### Grafana Dashboards

Grafana is used for visualization of metrics and alerting.

**Key Files:**
- `monitoring/grafana/provisioning/datasources/datasource.yml`: Datasource configuration
- `monitoring/grafana/provisioning/dashboards/dashboard.yml`: Dashboard configuration

**Dashboards:**
- Application Overview
- System Metrics
- API Performance
- Error Rates

### ELK Stack

The ELK (Elasticsearch, Logstash, Kibana) stack is used for log aggregation and analysis.

**Key Files:**
- `monitoring/logstash/config/logstash.yml`: Logstash configuration
- `monitoring/logstash/pipeline/logstash.conf`: Logstash pipeline configuration
- `monitoring/filebeat/filebeat.yml`: Filebeat configuration

**Log Collection:**
- Application logs
- Nginx access logs
- API logs
- System logs

### Health Checks

Health checks are implemented at multiple levels:

- Container health checks
- Kubernetes liveness and readiness probes
- Application health endpoints

## Security Infrastructure

### Web Application Firewall

A Web Application Firewall (WAF) is implemented using:

- Traefik middleware in Docker Compose
- Nginx Ingress Controller annotations in Kubernetes

**Security Rules:**
- SQL injection protection
- XSS protection
- Rate limiting
- IP filtering

### Security Scanning

Security scanning is integrated into the CI/CD pipeline:

- Dependency scanning
- Docker image scanning
- Static code analysis

### Rate Limiting

Rate limiting is implemented to protect against abuse:

- API rate limiting
- Authentication rate limiting

### Network Policies

Network policies are implemented to restrict traffic:

- Kubernetes network policies
- Docker network configuration

## Backup and Disaster Recovery

### Backup Strategy

Automated backups are implemented for:

- Configuration files
- Database
- Logs

**Key Files:**
- `scripts/backup.sh`: Backup script

**Backup Schedule:**
- Daily backups
- Weekly backups
- Monthly backups

### Disaster Recovery Plan

A disaster recovery plan is implemented to ensure business continuity.

**Key Files:**
- `scripts/disaster-recovery.sh`: Disaster recovery script

**Recovery Process:**
1. Restore configuration
2. Restore database
3. Redeploy services
4. Verify functionality

### Multi-Region Deployment

For high availability, the application can be deployed across multiple regions:

- Primary region
- Secondary region
- DNS-based failover

## Operational Procedures

### Deployment

**Standard Deployment:**
```bash
# Trigger deployment via GitHub Actions
git push origin main  # For production
git push origin develop  # For staging

# Manual deployment to Kubernetes
kubectl apply -k k8s/overlays/production

# Manual deployment with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Rollback

**Manual Rollback:**
```bash
# Kubernetes rollback
kubectl rollout undo deployment/frontend -n compliance-classifier-production

# Docker Compose rollback
docker-compose -f docker-compose.prod.yml down
docker image tag ${DOCKER_REGISTRY}/compliance-classifier-frontend:${PREVIOUS_TAG} ${DOCKER_REGISTRY}/compliance-classifier-frontend:latest
docker-compose -f docker-compose.prod.yml up -d
```

### Scaling

**Horizontal Scaling:**
```bash
# Kubernetes scaling
kubectl scale deployment/frontend -n compliance-classifier-production --replicas=5

# Docker Compose scaling
docker-compose -f docker-compose.prod.yml up -d --scale frontend=5
```

### Troubleshooting

**Common Issues:**

1. **Deployment Failures:**
   - Check CI/CD logs
   - Verify Kubernetes events
   - Check container logs

2. **Performance Issues:**
   - Check Grafana dashboards
   - Analyze Prometheus metrics
   - Review logs in Kibana

3. **Security Incidents:**
   - Check WAF logs
   - Review access logs
   - Analyze security scan reports