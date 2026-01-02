pipeline {
    agent any
    
    tools {
        maven 'Maven-3.9'
        jdk 'JDK-11'
    }
    
    environment {
        SONAR_HOST_URL = 'http://sonarqube:9000'
        SONAR_TOKEN = credentials('sonarqube-token')
        DOCKER_REGISTRY = 'docker.io'
        APP_NAME = 'gestion-stock'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                dir('gestion-stock') {
                    sh 'mvn clean compile'
                }
            }
        }
        
        stage('Unit Tests') {
            steps {
                dir('gestion-stock') {
                    sh 'mvn test'
                }
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                    jacoco(
                        execPattern: '**/target/jacoco.exec',
                        classPattern: '**/target/classes',
                        sourcePattern: '**/src/main/java'
                    )
                }
            }
        }
        
        stage('Code Quality Analysis') {
            steps {
                dir('gestion-stock') {
                    sh '''
                        mvn sonar:sonar \
                        -Dsonar.host.url=${SONAR_HOST_URL} \
                        -Dsonar.login=${SONAR_TOKEN} \
                        -Dsonar.projectKey=gestion-stock \
                        -Dsonar.projectName=gestion-stock \
                        -Dsonar.java.binaries=target/classes \
                        -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml
                    '''
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        
        stage('Package') {
            steps {
                dir('gestion-stock') {
                    sh 'mvn package -DskipTests'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${APP_NAME}:${BUILD_NUMBER} ."
                    sh "docker tag ${APP_NAME}:${BUILD_NUMBER} ${APP_NAME}:latest"
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    sh 'docker-compose down || true'
                    sh 'docker-compose up -d'
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
