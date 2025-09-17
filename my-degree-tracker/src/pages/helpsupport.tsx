import React, { useState, useEffect } from "react";
import {
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Link,
} from "@mui/material";
import styles from "../styles/HelpSupport.module.css";

const HelpSupport: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Typography variant="h6" className={styles.title}>Loading help & support...</Typography>
        <LinearProgress className={styles.progressBar} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <Typography variant="h4" className={styles.pageTitle}>
          Help & Support
        </Typography>
        <Typography variant="body1" className={styles.subtitle}>
          Everything you need to know about using the Degree Tracker system
        </Typography>
      </div>

      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <CardContent>
            <Typography variant="h6" className={styles.statLabel}>
              Total Features
            </Typography>
            <Typography variant="h3" className={styles.statValue}>
              5
            </Typography>
          </CardContent>
        </Card>
        
        <Card className={styles.statCard}>
          <CardContent>
            <Typography variant="h6" className={styles.statLabel}>
              Quick Help
            </Typography>
            <Typography variant="h3" className={styles.statValue}>
              24/7
            </Typography>
          </CardContent>
        </Card>
        
        <Card className={styles.statCard}>
          <CardContent>
            <Typography variant="h6" className={styles.statLabel}>
              User Guide
            </Typography>
            <Typography variant="h3" className={styles.statValue}>
              📖
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* System Purpose */}
      <div className={`${styles.sectionCard} ${styles.purposeCard}`}>
        <div className={styles.sectionHeader}>
          <Typography variant="h5" className={styles.sectionTitle}>
            🎯 System Purpose
          </Typography>
        </div>
        <div className={styles.sectionContent}>
          <Typography variant="body1" className={styles.sectionText}>
            This system is designed to help students track their degree status in real-time – 
            credits, grades, courses, and study program. Get comprehensive insights into your 
            academic journey and stay on track to complete your degree successfully.
          </Typography>
        </div>
      </div>

      {/* Feature Overview */}
      <div className={`${styles.sectionCard} ${styles.guidelinesCard}`}>
        <div className={styles.sectionHeader}>
          <Typography variant="h5" className={styles.sectionTitle}>
            🚀 Features Overview
          </Typography>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.featureGrid}>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>📊</span>
              <Typography variant="body2" className={styles.featureName}>
                My Progress
              </Typography>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>📈</span>
              <Typography variant="body2" className={styles.featureName}>
                Grade Report
              </Typography>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>📚</span>
              <Typography variant="body2" className={styles.featureName}>
                My Courses
              </Typography>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>🎓</span>
              <Typography variant="body2" className={styles.featureName}>
                My Program
              </Typography>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>🏠</span>
              <Typography variant="body2" className={styles.featureName}>
                Dashboard
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className={`${styles.sectionCard} ${styles.guidelinesCard}`}>
        <div className={styles.sectionHeader}>
          <Typography variant="h5" className={styles.sectionTitle}>
            📋 Usage Guidelines
          </Typography>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.guidelinesList}>
            <div className={styles.guidelineItem}>
              <Typography variant="body1" className={styles.guidelineText}>
                <strong>Login:</strong> Connect with your email and ID as password to get personal access to your academic data.
              </Typography>
            </div>
            <div className={styles.guidelineItem}>
              <Typography variant="body1" className={styles.guidelineText}>
                <strong>My Progress:</strong> View your credit points status, grade average, and comprehensive academic progress.
              </Typography>
            </div>
            <div className={styles.guidelineItem}>
              <Typography variant="body1" className={styles.guidelineText}>
                <strong>Grade Report:</strong> Analyze trend charts and detailed grades for each course with visual insights.
              </Typography>
            </div>
            <div className={styles.guidelineItem}>
              <Typography variant="body1" className={styles.guidelineText}>
                <strong>My Courses:</strong> Browse all courses you've completed with grades and current enrollments.
              </Typography>
            </div>
            <div className={styles.guidelineItem}>
              <Typography variant="body1" className={styles.guidelineText}>
                <strong>My Program:</strong> Review your study program details and track required courses for graduation.
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className={`${styles.sectionCard} ${styles.tipsCard}`}>
        <div className={styles.sectionHeader}>
          <Typography variant="h5" className={styles.sectionTitle}>
            💡 Tips for Effective Use
          </Typography>
        </div>
        <div className={styles.sectionContent}>
          <Typography variant="body1" className={styles.sectionText}>
            Keep your data updated and check your progress regularly to ensure you complete your degree on time. 
            Use the dashboard for quick overviews and dive into specific sections for detailed analysis. 
            Set up regular check-ins to monitor your GPA and credit accumulation.
          </Typography>
        </div>
      </div>

      {/* Contact */}
      <div className={`${styles.sectionCard} ${styles.contactCard}`}>
        <div className={styles.sectionHeader}>
          <Typography variant="h5" className={styles.sectionTitle}>
            📞 Contact Support
          </Typography>
        </div>
        <div className={styles.sectionContent}>
          <Typography variant="body1" className={styles.sectionText}>
            For additional questions, technical support, or feature requests, please contact our support team at{" "}
            <Link 
              href="mailto:support@degree-tracker.com"
              className={styles.contactLink}
            >
              support@degree-tracker.com
            </Link>
            {". "}We're here to help you succeed in your academic journey!
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
