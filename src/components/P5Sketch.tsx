'use client';

import { useEffect, useRef } from 'react';

const P5Sketch = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<any>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    const loadP5 = async () => {
      const p5 = (await import('p5')).default;
      
      if (!canvasRef.current) return;

      const sketch = (p: any) => {
        let centerX: number, centerY: number;
        let numCircles = 5; // 5 layers, inner 4 with 2 circles, outermost with 1 circle
        let maxRadius: number; // Will be calculated based on screen size
        let dotRadius: number; // Will be scaled
        let layerThickness: number; // Will be scaled
        let numInnerLayers = numCircles - 1; // 4 inner layers
        let totalThickness: number; // Will be calculated
        let numGaps = numCircles; // 5 gaps
        let gapSize: number; // Will be calculated
        let baseRadii: number[]; // Array of base radii for each layer
        let labels: any[]; // Array of labels for dot and layers
        let responsiveScale: number; // Global scale factor for all elements

        const calculateDimensions = () => {
          // Get viewport dimensions
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          
          // Calculate canvas size with padding
          const padding = vw < 768 ? 20 : 40; // Less padding on mobile
          const maxWidth = Math.min(vw - padding, 1200);
          const maxHeight = Math.min(vh - padding, 900);
          
          // Use the smaller dimension to ensure circle fits
          const canvasSize = Math.min(maxWidth, maxHeight);
          
          // Calculate responsive scale factor
          const baseSize = 800; // Base size for scaling
          responsiveScale = canvasSize / baseSize;
          responsiveScale = Math.max(0.4, Math.min(1.5, responsiveScale)); // Clamp between 0.4x and 1.5x
          
          // Scale all base measurements
          maxRadius = 300 * responsiveScale;
          dotRadius = 4 * responsiveScale;
          layerThickness = 8 * responsiveScale;
          
          return { width: canvasSize, height: canvasSize };
        };

        const initializeRadii = () => {
          // Calculate static base radii for equal gaps
          totalThickness = numInnerLayers * layerThickness;
          let totalGapSpace = maxRadius - dotRadius - totalThickness;
          gapSize = totalGapSpace / numGaps;
          baseRadii = [];
          let currentR = dotRadius;
          for (let i = 0; i < numCircles; i++) {
            currentR += gapSize;
            baseRadii[i] = currentR;
            if (i < numInnerLayers) {
              currentR += layerThickness;
            }
          }
        };

        p.setup = () => {
          const dimensions = calculateDimensions();
          p.createCanvas(dimensions.width, dimensions.height);
          centerX = p.width / 2;
          centerY = p.height / 2;
          p.frameRate(30);
          
          // Labels: Hebrew with [English] translation
          labels = [
            {hebrew: 'אין סוף', english: 'Ein Sof'}, // 0: Central dot
            {hebrew: 'אצילות', english: 'Atzilut'},   // 1: Layer 0 (innermost)
            {hebrew: 'בריאה', english: 'Beriah'},    // 2: Layer 1
            {hebrew: 'יצירה', english: 'Yetzirah'},  // 3: Layer 2
            {hebrew: 'עשיה', english: 'Asiyah'},     // 4: Layer 3
            {hebrew: 'גבול', english: 'Boundary'}     // 5: Layer 4 (outermost)
          ];
          
          initializeRadii();
        };

        p.windowResized = () => {
          const dimensions = calculateDimensions();
          p.resizeCanvas(dimensions.width, dimensions.height);
          centerX = p.width / 2;
          centerY = p.height / 2;
          initializeRadii();
        };

        p.draw = () => {
          p.background(255); // White background for scholarly aesthetic
          
          let time = p.frameCount * 0.0167; // Slower time progression (1/3 speed)
          let phase = p.sin(time * 1.0); // Faster cycle for contraction/expansion
          let contractProgress = p.max(0, -phase); // 0 to 1 during contraction
          let contractionAmount = contractProgress * 0.3;
          let scaleFactor = 1 - contractionAmount;
          let maxGapAngle = p.PI / 18; // Small gap, up to ~10 degrees
          let gapAngle = contractProgress * maxGapAngle;
          let rotation = time * 1.0; // Faster rotation speed for sweeping gap
          let arcStart = rotation % p.TWO_PI;
          let arcEnd = arcStart + p.TWO_PI - gapAngle;
          
          // Compute scaled base radii
          let scaledBase: number[] = [];
          let currentScaledR = dotRadius * scaleFactor;
          for (let i = 0; i < numCircles; i++) {
            currentScaledR += gapSize * scaleFactor;
            scaledBase[i] = currentScaledR;
            if (i < numInnerLayers) {
              currentScaledR += layerThickness * scaleFactor;
            }
          }
          
          let weight = 4 * responsiveScale; // Responsive thickness for all main circles
          let numThins = 10;
          let endGap = 10 * responsiveScale; // Responsive pixel gap at both ends for thinner circles
          
          // Set responsive text style for labels
          p.textSize(12 * responsiveScale);
          p.textAlign(p.LEFT, p.CENTER);
          p.textStyle(p.NORMAL);
          
          // Draw label for central dot (always visible)
          let dotAlpha = 255;
          p.fill(0, 0, 0, dotAlpha);
          p.text(labels[0].hebrew + ' [' + labels[0].english + ']', centerX + 10 * responsiveScale, centerY - 20 * responsiveScale); // Responsive offset
          p.noFill();
          
          // Draw thinner circles in each gap, appearing progressively from inner to outer during contraction
          for (let gap = 0; gap < numCircles; gap++) {
            let innerR: number;
            if (gap === 0) {
              innerR = dotRadius * scaleFactor;
            } else {
              let prevI = gap - 1;
              innerR = scaledBase[prevI];
              if (prevI < numInnerLayers) {
                innerR += layerThickness * scaleFactor;
              }
            }
            let outerR = scaledBase[gap];
            let totalGapDist = outerR - innerR;
            let middleSpace = totalGapDist - 2 * endGap;
            
            // Progressive visibility: inner gaps appear first
            let threshold = (gap / (numGaps - 1)) * 0.8;
            let vis = p.max(0, (contractProgress - threshold) / 0.2);
            let alpha = p.min(1, vis) * 255;
            
            if (alpha > 1) { // Only draw if somewhat visible
              p.noFill();
              if (middleSpace > 0 && numThins > 1) {
                let numMiddleGaps = numThins - 1;
                let thinGap = middleSpace / numMiddleGaps;
                for (let j = 0; j < numThins; j++) {
                  let baseThinRadius = innerR + endGap + j * thinGap;
                  let pulse = p.sin(time + gap * 0.1 + j * 0.05) * 2; // Subtle pulse
                  let thinRadius = baseThinRadius + pulse;
                  p.stroke(0, 0, 0, alpha); // Black with alpha
                  p.strokeWeight(weight / 5); // Thinner stroke
                  p.arc(centerX, centerY, thinRadius * 2, thinRadius * 2, arcStart, arcEnd);
                }
              } else {
                // Fallback if space is too small: space evenly
                let numGapsThin = numThins + 1;
                let gapSizeThin = totalGapDist / numGapsThin;
                for (let j = 0; j < numThins; j++) {
                  let baseThinRadius = innerR + (j + 1) * gapSizeThin;
                  let pulse = p.sin(time + gap * 0.1 + j * 0.05) * 2;
                  let thinRadius = baseThinRadius + pulse;
                  p.stroke(0, 0, 0, alpha); // Black with alpha
                  p.strokeWeight(weight / 5); // Thinner stroke
                  p.arc(centerX, centerY, thinRadius * 2, thinRadius * 2, arcStart, arcEnd);
                }
              }
            }
          }
          
          // Draw main circles for each layer with progressive visibility and subtle pulsing
          p.noFill();
          for (let i = 0; i < numCircles; i++) {
            // Progressive visibility: outer always visible, inner appear progressively
            let progressThreshold = (i === numCircles - 1) ? -1 : (i / (numCircles - 1)) * 0.8;
            let vis = p.max(0, p.min(1, (contractProgress - progressThreshold) / 0.2));
            let alpha = vis * 255;
            
            let baseRadius1 = scaledBase[i];
            let pulse1 = p.sin(time + i * 0.1) * 3; // Subtle pulse for first circle
            let radius1 = baseRadius1 + pulse1;
            p.stroke(0, 0, 0, alpha); // Black with alpha
            p.strokeWeight(weight); // Uniform thickness
            p.arc(centerX, centerY, radius1 * 2, radius1 * 2, arcStart, arcEnd);
            
            // Draw second main circle only for inner layers
            if (i < numInnerLayers) {
              let baseRadius2 = baseRadius1 + layerThickness * scaleFactor;
              let pulse2 = p.sin(time + i * 0.1 + p.PI) * 3; // Offset phase for second circle
              let radius2 = baseRadius2 + pulse2;
              p.stroke(0, 0, 0, alpha); // Same alpha as layer
              p.strokeWeight(weight); // Same thickness
              p.arc(centerX, centerY, radius2 * 2, radius2 * 2, arcStart, arcEnd);
            }
            
            // Draw label for this layer
            let midR = baseRadius1 + (i < numInnerLayers ? layerThickness * scaleFactor / 2 : 0);
            let labelAlpha = alpha;
            p.fill(0, 0, 0, labelAlpha);
            p.noStroke();
            let labelY = centerY + (i * 15 * responsiveScale - 30 * responsiveScale); // Responsive vertical offset per layer
            p.text(labels[i + 1].hebrew + ' [' + labels[i + 1].english + ']', centerX + midR + 5 * responsiveScale, labelY);
            p.noFill();
          }
          
          // Draw small black dot at the center with subtle pulse, always visible
          let baseDotRadius = dotRadius * scaleFactor;
          let dotPulse = p.sin(time) * 1;
          let scaledDotRadius = baseDotRadius + dotPulse;
          p.fill(0); // Black dot
          p.noStroke();
          p.arc(centerX, centerY, scaledDotRadius * 2, scaledDotRadius * 2, arcStart, arcEnd, p.PIE);
        };
      };

      p5InstanceRef.current = new p5(sketch, canvasRef.current);
    };

    loadP5();

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={canvasRef} />;
};

export default P5Sketch;
