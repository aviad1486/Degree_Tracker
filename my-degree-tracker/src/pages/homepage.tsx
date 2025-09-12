import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
} from "@mui/material";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // Mock data (בשלב מאוחר יותר נחבר ל-Firestore)
  const studentName = "אביעד זר";
  const totalCredits = 120;
  const completedCredits = 72;
  const gpa = 92.3;
  const remainingCourses = 6;
  const currentCourses = 4;

  useEffect(() => {
    // סימולציה של טעינת נתונים (כמו Firestore)
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* אינדיקציית טעינה */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {!loading && (
        <>
          {/* ברכה אישית */}
          <Typography variant="h5" gutterBottom>
            שלום, {studentName}! 👋
          </Typography>

          {/* תקציר מצב התואר */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">נק"ז שהושלמו</Typography>
                  <Typography variant="body1">
                    {completedCredits}/{totalCredits}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">ממוצע ציונים</Typography>
                  <Typography variant="body1">{gpa}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">קורסים שנותרו</Typography>
                  <Typography variant="body1">{remainingCourses}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">קורסים בסמסטר נוכחי</Typography>
                  <Typography variant="body1">{currentCourses}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* קיצורי דרך */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              קיצורי דרך
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Button variant="contained" component={Link} to="/myprogress">
                  ההתקדמות שלי
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" component={Link} to="/gradereport">
                  דו"ח ציונים
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" component={Link} to="/mycourses">
                  הקורסים שלי
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" component={Link} to="/myprogram">
                  המסלול שלי
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" component={Link} to="/helpsupport">
                  עזרה ותמיכה
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
};

export default HomePage;