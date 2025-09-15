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
    <Box sx={{ p: 3 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {!loading && (
        <>
          <Typography variant="h5" gutterBottom>
            עזרה ותמיכה ❓
          </Typography>

          {/* הסבר כללי */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                מטרת המערכת
              </Typography>
              <Typography variant="body1">
                המערכת נועדה לעזור לסטודנטים לעקוב אחר מצב התואר שלהם בזמן אמת –
                נק"ז, ציונים, קורסים ומסלול לימודים.
              </Typography>
            </CardContent>
          </Card>

          {/* הנחיות שימוש */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                הנחיות לשימוש במסכים
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="להתחברות – התחבר עם אימייל ות״ז כסיסמה בכדי לקבל גישה אישית." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="ההתקדמות שלי – ראה את מצב נקודות הזכות, ממוצע הציונים ועוד." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="דו״ח ציונים – צפה בגרף מגמות ובציונים מפורטים לכל קורס." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="הקורסים שלי – רשימת הקורסים שעברת עם ציונים." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="המסלול שלי – פרטי מסלול הלימודים שלך והקורסים הנדרשים." />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* טיפים */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                טיפים לשימוש יעיל
              </Typography>
              <Typography variant="body1">
                שמור את הנתונים שלך מעודכנים, ובדוק את התקדמותך באופן קבוע כדי
                להבטיח שתסיים את התואר בזמן.
              </Typography>
            </CardContent>
          </Card>

          {/* יצירת קשר */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                צור קשר
              </Typography>
              <Typography variant="body1">
                לשאלות נוספות ניתן לפנות לכתובת{" "}
                <Link href="mailto:support@degree-tracker.com">
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
