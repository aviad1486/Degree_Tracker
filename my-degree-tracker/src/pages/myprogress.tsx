import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const MyProgress: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // Mock data (בשלב מאוחר יותר יגיע מ-Firestore)
  const totalCredits = 120;
  const completedCredits = 72;
  const gpa = 92.3;
  const currentCourses = ["מבוא למדעי המחשב", "מערכות הפעלה", "בינה מלאכותית", "בסיסי נתונים"];
  const upcomingEvents = [
    { title: "הגשת פרויקט סופי", date: "20/10/2025" },
    { title: "מבחן במערכות הפעלה", date: "25/10/2025" },
    { title: "תרגיל בבינה מלאכותית", date: "1/11/2025" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const progressPercent = Math.round((completedCredits / totalCredits) * 100);

  return (
    <Box sx={{ p: 3 }}>
      {/* אינדיקציית טעינה */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {!loading && (
        <>
          <Typography variant="h5" gutterBottom>
            ההתקדמות שלי 📊
          </Typography>

          {/* פרוגרס כללי */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                נק"ז שהושלמו
              </Typography>
              <LinearProgress variant="determinate" value={progressPercent} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {completedCredits}/{totalCredits} נק"ז ({progressPercent}%)
              </Typography>
            </CardContent>
          </Card>

          {/* נתוני מפתח */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">ממוצע ציונים</Typography>
                  <Typography variant="body1">{gpa}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">קורסים נוכחיים</Typography>
                  <List dense>
                    {currentCourses.map((course, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={course} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* אירועים קרובים */}
          <Box sx={{ mt: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">אירועים קרובים</Typography>
                <List dense>
                  {upcomingEvents.map((event, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={event.title}
                        secondary={`תאריך: ${event.date}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        </>
      )}
    </Box>
  );
};

export default MyProgress;
