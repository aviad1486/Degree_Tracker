import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const ResponsiveFontDemo: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h1" gutterBottom>
        H1 - Responsive Heading
      </Typography>
      <Typography variant="h2" gutterBottom>
        H2 - Large Section Title
      </Typography>
      <Typography variant="h3" gutterBottom>
        H3 - Medium Section Title
      </Typography>
      <Typography variant="h4" gutterBottom>
        H4 - Small Section Title
      </Typography>
      <Typography variant="h5" gutterBottom>
        H5 - Subsection Title
      </Typography>
      <Typography variant="h6" gutterBottom>
        H6 - Minor Heading
      </Typography>
      
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="body1" paragraph>
            Body1: This is the main body text that will scale responsively. 
            Notice how the font size automatically adjusts based on screen size 
            without any manual fontSize specifications!
          </Typography>
          <Typography variant="body2">
            Body2: This is smaller body text that also scales automatically.
          </Typography>
        </CardContent>
      </Card>
      
      <Typography variant="caption" display="block" sx={{ mt: 2 }}>
        Caption: This text will also scale appropriately across devices.
      </Typography>
    </Box>
  );
};

export default ResponsiveFontDemo;