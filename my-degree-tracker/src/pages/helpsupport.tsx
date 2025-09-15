import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";

const HelpSupport: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {!loading && (
        <>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
          >
            Help & Support ❓
          </Typography>

          {/* General Description */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                System Purpose
              </Typography>
              <Typography 
                variant="body1"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                This system is designed to help students track their degree status in real-time –
                credits, grades, courses, and study program.
              </Typography>
            </CardContent>
          </Card>

          {/* Usage Guidelines */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                Screen Usage Guidelines
              </Typography>
              <List dense sx={{ 
                '& .MuiListItemText-primary': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}>
                <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                  <ListItemText primary="Login – Connect with email and ID as password to get personal access." />
                </ListItem>
                <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                  <ListItemText primary="My Progress – View your credit points status, grade average and more." />
                </ListItem>
                <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                  <ListItemText primary="Grade Report – View trend charts and detailed grades for each course." />
                </ListItem>
                <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                  <ListItemText primary="My Courses – List of courses you've passed with grades." />
                </ListItem>
                <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                  <ListItemText primary="My Program – Your study program details and required courses." />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                Tips for Effective Use
              </Typography>
              <Typography 
                variant="body1"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Keep your data updated and check your progress regularly to
                ensure you complete your degree on time.
              </Typography>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                Contact Us
              </Typography>
              <Typography 
                variant="body1"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                For additional questions, please contact{" "}
                <Link 
                  href="mailto:support@degree-tracker.com"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  support@degree-tracker.com
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default HelpSupport;
