pipeline {
    agent any

    environment {
        FRONTEND_IMAGE        = "pickzy-frontend:latest"
        BACKEND_IMAGE         = "pickzy-backend:latest"
        DOCKER_REGISTRY       = "docker.io"
        DOCKER_CREDENTIALS_ID = "Docker-creds"   // Must exist in Jenkins
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/saurab28/E-commerce.git'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin $DOCKER_REGISTRY'
                }
            }
        }

        stage('Build Images') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        sh '''
                            echo "🚀 Building Frontend Image..."
                            DOCKER_BUILDKIT=1 docker build --pull -t ${FRONTEND_IMAGE} -f Dockerfile.frontend .
                        '''
                    }
                }
                stage('Build Backend') {
                    steps {
                        sh '''
                            echo "🚀 Building Backend Image..."
                            DOCKER_BUILDKIT=1 docker build --pull -t ${BACKEND_IMAGE} -f backend/Dockerfile.backend ./backend
                        '''
                    }
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh '''
                    echo "🛑 Stopping old containers..."
                    docker-compose down || true

                    echo "🚀 Starting new containers..."
                    docker-compose up -d --build

                    echo "🧹 Cleaning unused images..."
                    docker image prune -f
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment completed successfully!"
        }
        failure {
            echo "❌ Deployment failed. Check logs!"
        }
    }
}
