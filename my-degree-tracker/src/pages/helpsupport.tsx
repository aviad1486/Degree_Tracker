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
            עזרה ותמיכה ❓
          </Typography>

          {/* הסבר כללי */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                מטרת המערכת
              </Typography>
              <Typography 
                variant="body1"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                המערכת נועדה לעזור לסטודנטים לעקוב אחר מצב התואר שלהם בזמן אמת –
                נק"ז, ציונים, קורסים ומסלול לימודים.
              </Typography>
            </CardContent>
          </Card>

          {/* הנחיות שימוש */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                הנחיות לשימוש במסכים
              </Typography>
              <List dense sx={{ 
                '& .MuiListItemText-primary': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}>
                <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                  <ListItemText primary="להתחברות – התחבר עם אימייל ות״ז כסיסמה בכדי לקבל גישה אישית." />
                </ListItem>
                <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                  <ListItemText primary="ההתקדמות שלי – ראה את מצב נקודות הזכות, ממוצע הציונים ועוד." />
                </ListItem>
                <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                  <ListItemText primary="דו״ח ציונים – צפה בגרף מגמות ובציונים מפורטים לכל קורס." />
                </ListItem>
                <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                  <ListItemText primary="הקורסים שלי – רשימת הקורסים שעברת עם ציונים." />
                </ListItem>
                <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                  <ListItemText primary="המסלול שלי – פרטי מסלול הלימודים שלך והקורסים הנדרשים." />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* טיפים */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                טיפים לשימוש יעיל
              </Typography>
              <Typography 
                variant="body1"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                שמור את הנתונים שלך מעודכנים, ובדוק את התקדמותך באופן קבוע כדי
                להבטיח שתסיים את התואר בזמן.
              </Typography>
            </CardContent>
          </Card>

          {/* יצירת קשר */}
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                צור קשר
              </Typography>
              <Typography 
                variant="body1"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                לשאלות נוספות ניתן לפנות לכתובת{" "}
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
