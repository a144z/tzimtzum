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
        let layerColors: any[]; // Array of base colors for layers (RGB)
        let dotColor: any; // Color for central dot
        let responsiveScale: number; // Global scale factor for all elements

        const calculateDimensions = () => {
          // Get viewport dimensions
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          
          // Fixed base canvas size
          const baseWidth = 800;
          const baseHeight = 600;
          
          // Scale canvas proportionally but ensure it fits
          const scale = Math.min((vw - 40) / baseWidth, (vh - 40) / baseHeight, 1.0);
          const canvasWidth = baseWidth * scale;
          const canvasHeight = baseHeight * scale;
          
          // Calculate responsive scale factor for content
          responsiveScale = scale;
          responsiveScale = Math.max(0.4, Math.min(1.5, responsiveScale)); // Clamp between 0.4x and 1.5x
          
          // Scale all base measurements
          maxRadius = 300 * responsiveScale;
          dotRadius = 4 * responsiveScale;
          layerThickness = 8 * responsiveScale;
          
          return { width: canvasWidth, height: canvasHeight };
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
          
          dotColor = p.color(0); // Black for dot
          
          // Labels: Hebrew with [English translation including element]
          labels = [
            {hebrew: 'אין סוף', english: 'Ein Sof [Infinite]'}, // 0: Central dot
            {hebrew: 'אצילות', english: 'Atzilut [Emanation - Fire]'},   // 1: Layer 0 (innermost)
            {hebrew: 'בריאה', english: 'Beriah [Creation - Water]'},    // 2: Layer 1
            {hebrew: 'יצירה', english: 'Yetzirah [Formation - Air]'},  // 3: Layer 2
            {hebrew: 'עשיה', english: 'Asiyah [Action - Earth]'},     // 4: Layer 3
            {hebrew: 'גבול', english: 'Boundary [Cosmic Limit]'}     // 5: Layer 4 (outermost)
          ];
          
          // Base colors for layers (Fire: red, Water: blue, Air: cyan, Earth: green, Boundary: purple)
          layerColors = [
            p.color(255, 100, 100), // Layer 0: Fire (bright red)
            p.color(100, 100, 255), // Layer 1: Water (blue)
            p.color(100, 255, 255), // Layer 2: Air (cyan)
            p.color(100, 255, 100), // Layer 3: Earth (green)
            p.color(200, 100, 200)  // Layer 4: Boundary (purple)
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
            
            // Get colors for gradient effect
            let innerThinColor = (gap === 0 ? dotColor : layerColors[gap - 1]);
            let outerThinColor = layerColors[gap];
            
            if (alpha > 1) { // Only draw if somewhat visible
              p.noFill();
              if (middleSpace > 0 && numThins > 1) {
                let numMiddleGaps = numThins - 1;
                let thinGap = middleSpace / numMiddleGaps;
                for (let j = 0; j < numThins; j++) {
                  let frac = j / (numThins - 1);
                  let thinColor = p.lerpColor(innerThinColor, outerThinColor, frac);
                  let fadedThinColor = p.lerpColor(thinColor, p.color(255), contractProgress * 0.5); // Gradient fade to white during contraction
                  let baseThinRadius = innerR + endGap + j * thinGap;
                  let pulse = p.sin(time + gap * 0.1 + j * 0.05) * 2; // Subtle pulse
                  let thinRadius = baseThinRadius + pulse;
                  let levels = fadedThinColor.levels || [p.red(fadedThinColor), p.green(fadedThinColor), p.blue(fadedThinColor)];
                  p.stroke(levels[0], levels[1], levels[2], alpha);
                  p.strokeWeight(weight / 5); // Thinner stroke
                  p.arc(centerX, centerY, thinRadius * 2, thinRadius * 2, arcStart, arcEnd);
                }
              } else {
                // Fallback if space is too small: space evenly
                let numGapsThin = numThins + 1;
                let gapSizeThin = totalGapDist / numGapsThin;
                for (let j = 0; j < numThins; j++) {
                  let frac = j / (numThins - 1);
                  let thinColor = p.lerpColor(innerThinColor, outerThinColor, frac);
                  let fadedThinColor = p.lerpColor(thinColor, p.color(255), contractProgress * 0.5);
                  let baseThinRadius = innerR + (j + 1) * gapSizeThin;
                  let pulse = p.sin(time + gap * 0.1 + j * 0.05) * 2;
                  let thinRadius = baseThinRadius + pulse;
                  let levels = fadedThinColor.levels || [p.red(fadedThinColor), p.green(fadedThinColor), p.blue(fadedThinColor)];
                  p.stroke(levels[0], levels[1], levels[2], alpha);
                  p.strokeWeight(weight / 5); // Thinner stroke
                  p.arc(centerX, centerY, thinRadius * 2, thinRadius * 2, arcStart, arcEnd);
                }
              }
            }
          }
          
          // Draw main circles for each layer with progressive visibility and subtle pulsing
          p.noFill();
          for (let i = 0; i < numCircles; i++) {
            // Progressive visibility: layers appear early and stay visible longer
            // Outer layer (i=4) always visible, inner layers appear progressively but stay longer
            let progressThreshold = (i === numCircles - 1) ? -1 : (i / (numCircles - 1)) * 0.3;
            let fadeOutThreshold = (i === numCircles - 1) ? 1.2 : 0.7 + (i / (numCircles - 1)) * 0.3;
            
            // Calculate visibility: appear early, stay visible, then fade out
            let appearProgress = p.max(0, p.min(1, (contractProgress - progressThreshold) / 0.15));
            let fadeOutProgress = p.max(0, p.min(1, (contractProgress - fadeOutThreshold) / 0.2));
            let vis = appearProgress * (1 - fadeOutProgress);
            let alpha = vis * 255;
            
            let c = layerColors[i]; // Base color for this layer
            
            // First circle with element-based color and pulsing brightness
            let phaseSin1 = p.sin(time + i * 0.1);
            let pulse1 = phaseSin1 * 3; // Subtle pulse for radius
            let bright1 = 0.8 + phaseSin1 * 0.2; // Synced brightness pulse (0.6 to 1.0)
            let cLevels = c.levels || [p.red(c), p.green(c), p.blue(c)];
            let pulsedC1 = p.color(cLevels[0] * bright1, cLevels[1] * bright1, cLevels[2] * bright1);
            let fadedC1 = p.lerpColor(pulsedC1, p.color(255), contractProgress); // Gradient fade to white during contraction
            let radius1 = scaledBase[i] + pulse1;
            let fadedLevels1 = fadedC1.levels || [p.red(fadedC1), p.green(fadedC1), p.blue(fadedC1)];
            p.stroke(fadedLevels1[0], fadedLevels1[1], fadedLevels1[2], alpha);
            p.strokeWeight(weight); // Uniform thickness
            p.arc(centerX, centerY, radius1 * 2, radius1 * 2, arcStart, arcEnd);
            
            // Draw second main circle only for inner layers
            if (i < numInnerLayers) {
              let phaseSin2 = p.sin(time + i * 0.1 + p.PI); // Opposite phase
              let pulse2 = phaseSin2 * 3; // Subtle pulse for radius
              let bright2 = 0.8 + phaseSin2 * 0.2; // Synced brightness pulse
              let pulsedC2 = p.color(cLevels[0] * bright2, cLevels[1] * bright2, cLevels[2] * bright2);
              let fadedC2 = p.lerpColor(pulsedC2, p.color(255), contractProgress); // Same fade
              let baseRadius2 = scaledBase[i] + layerThickness * scaleFactor;
              let radius2 = baseRadius2 + pulse2;
              let fadedLevels2 = fadedC2.levels || [p.red(fadedC2), p.green(fadedC2), p.blue(fadedC2)];
              p.stroke(fadedLevels2[0], fadedLevels2[1], fadedLevels2[2], alpha);
              p.strokeWeight(weight); // Same thickness
              p.arc(centerX, centerY, radius2 * 2, radius2 * 2, arcStart, arcEnd);
            }
            
            // Draw label for this layer (same visibility as the layer)
            let midR = scaledBase[i] + (i < numInnerLayers ? layerThickness * scaleFactor / 2 : 0);
            let labelAlpha = alpha; // Use same alpha as the layer
            p.fill(0, 0, 0, labelAlpha);
            p.noStroke();
            let labelY = centerY + (i * 15 * responsiveScale - 30 * responsiveScale); // Responsive vertical offset per layer
            p.text(labels[i + 1].hebrew + ' [' + labels[i + 1].english + ']', centerX + midR + 5 * responsiveScale, labelY);
            p.noFill();
          }
          
          // Draw small black dot at the center with subtle pulse, always visible (slight fade for consistency)
          let baseDotRadius = dotRadius * scaleFactor;
          let dotPulse = p.sin(time) * 1;
          let scaledDotRadius = baseDotRadius + dotPulse;
          let fadedDot = p.lerpColor(dotColor, p.color(255), contractProgress * 0.5); // Mild fade
          let fadedDotLevels = fadedDot.levels || [p.red(fadedDot), p.green(fadedDot), p.blue(fadedDot)];
          p.fill(fadedDotLevels[0], fadedDotLevels[1], fadedDotLevels[2]); // Apply fade
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
