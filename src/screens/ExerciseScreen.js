import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';

export default function ExerciseScreen({ route, navigation }) {
  const { workout, exerciseIndex } = route.params;
  const exercise = workout.exercises[exerciseIndex];
  const isLast = exerciseIndex === workout.exercises.length - 1;

  // Timer state — used for duration-based exercises AND rest period
  const [phase, setPhase] = useState('exercise'); // 'exercise' | 'rest' | 'done'
  const [timeLeft, setTimeLeft] = useState(exercise.duration || 0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(1)).current;

  const isDurationBased = !!exercise.duration;
  const totalTime = phase === 'rest' ? exercise.rest : (exercise.duration || exercise.rest);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Animate progress bar
  useEffect(() => {
    if (timerRunning) {
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: timeLeft * 1000,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnim.stopAnimation();
    }
  }, [timerRunning, phase]);

  // Countdown tick
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setTimerRunning(false);
            handleTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerRunning, phase, currentSet]);

  const handleTimerEnd = () => {
    if (phase === 'exercise') {
      // Move to rest
      if (currentSet < exercise.sets) {
        startRest();
      } else {
        setPhase('done');
      }
    } else if (phase === 'rest') {
      // Next set
      const nextSet = currentSet + 1;
      setCurrentSet(nextSet);
      setPhase('exercise');
      setTimeLeft(exercise.duration || 0);
      if (isDurationBased) {
        progressAnim.setValue(1);
      }
    }
  };

  const startRest = () => {
    setPhase('rest');
    setTimeLeft(exercise.rest);
    progressAnim.setValue(1);
    setTimerRunning(true);
  };

  const toggleTimer = () => {
    setTimerRunning(r => !r);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTimerRunning(false);
    setPhase('exercise');
    setCurrentSet(1);
    setTimeLeft(exercise.duration || 0);
    progressAnim.setValue(1);
  };

  const completeSet = () => {
    if (currentSet < exercise.sets) {
      startRest();
    } else {
      setPhase('done');
    }
  };

  const goNext = () => {
    if (isLast) {
      navigation.popToTop();
    } else {
      navigation.replace('Exercise', {
        workout,
        exerciseIndex: exerciseIndex + 1,
      });
    }
  };

  const phaseLabel = phase === 'rest' ? 'REST' : phase === 'done' ? 'DONE!' : 'GO!';
  const phaseColor = phase === 'rest' ? '#457B9D' : phase === 'done' ? '#2A9D8F' : workout.color;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top Nav */}
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>
            {exerciseIndex + 1} / {workout.exercises.length}
          </Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((exerciseIndex + 1) / workout.exercises.length) * 100}%`,
                backgroundColor: workout.color,
              },
            ]}
          />
        </View>

        {/* Exercise Info */}
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseEmoji}>{exercise.emoji}</Text>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.muscleText}>{exercise.muscles}</Text>
        </View>

        {/* Set / Phase Indicator */}
        <View style={[styles.phaseCard, { backgroundColor: phaseColor + '22', borderColor: phaseColor }]}>
          <Text style={[styles.phaseLabel, { color: phaseColor }]}>{phaseLabel}</Text>
          {phase !== 'done' && (
            <Text style={styles.setInfo}>
              Set {currentSet} of {exercise.sets}
            </Text>
          )}
        </View>

        {/* Timer or Reps */}
        {phase === 'done' ? (
          <View style={styles.doneContainer}>
            <Text style={styles.doneEmoji}>🎉</Text>
            <Text style={styles.doneText}>Exercise Complete!</Text>
          </View>
        ) : isDurationBased || phase === 'rest' ? (
          /* Duration / Rest Timer */
          <View style={styles.timerContainer}>
            <View style={styles.timerCircle}>
              <Text style={[styles.timerNumber, { color: phaseColor }]}>{timeLeft}</Text>
              <Text style={styles.timerSec}>seconds</Text>
            </View>
            {/* Animated progress bar */}
            <View style={styles.timerTrack}>
              <Animated.View
                style={[
                  styles.timerFill,
                  {
                    backgroundColor: phaseColor,
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <View style={styles.timerBtns}>
              <TouchableOpacity style={[styles.timerBtn, { borderColor: phaseColor }]} onPress={toggleTimer}>
                <Text style={[styles.timerBtnText, { color: phaseColor }]}>
                  {timerRunning ? '⏸ Pause' : '▶ Start'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resetBtn} onPress={resetTimer}>
                <Text style={styles.resetBtnText}>↺ Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Rep-based */
          <View style={styles.repContainer}>
            <Text style={styles.repNumber}>{exercise.reps}</Text>
            <Text style={styles.repLabel}>REPS</Text>
            <TouchableOpacity
              style={[styles.completeSetBtn, { backgroundColor: workout.color }]}
              onPress={completeSet}
            >
              <Text style={styles.completeSetText}>
                {currentSet < exercise.sets ? `✓ Done — Rest ${exercise.rest}s` : '✓ Complete Exercise'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How to do it</Text>
          <Text style={styles.instructionsText}>{exercise.instructions}</Text>
        </View>

        {/* Bottom Actions */}
        {phase === 'done' && (
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: workout.color }]}
            onPress={goNext}
          >
            <Text style={styles.nextBtnText}>
              {isLast ? '🏁 Finish Workout' : 'Next Exercise →'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 20,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 12,
  },
  backText: {
    color: '#8892b0',
    fontSize: 16,
    fontWeight: '600',
  },
  navTitle: {
    color: '#64ffda',
    fontSize: 14,
    fontWeight: '700',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#16213e',
    borderRadius: 2,
    marginBottom: 20,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  exerciseHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseEmoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  muscleText: {
    color: '#8892b0',
    fontSize: 13,
  },
  phaseCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  phaseLabel: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  setInfo: {
    color: '#8892b0',
    fontSize: 13,
    marginTop: 2,
  },
  doneContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  doneEmoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  doneText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2A9D8F',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#16213e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  timerNumber: {
    fontSize: 52,
    fontWeight: '900',
  },
  timerSec: {
    color: '#8892b0',
    fontSize: 12,
    marginTop: -4,
  },
  timerTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#16213e',
    borderRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  timerFill: {
    height: 6,
    borderRadius: 3,
  },
  timerBtns: {
    flexDirection: 'row',
    gap: 12,
  },
  timerBtn: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  timerBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  resetBtn: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    color: '#8892b0',
    fontSize: 16,
    fontWeight: '600',
  },
  repContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  repNumber: {
    fontSize: 80,
    fontWeight: '900',
    color: '#64ffda',
    lineHeight: 90,
  },
  repLabel: {
    fontSize: 16,
    color: '#8892b0',
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 20,
  },
  completeSetBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  completeSetText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  instructionsCard: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  instructionsTitle: {
    color: '#64ffda',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  instructionsText: {
    color: '#ccd6f6',
    fontSize: 14,
    lineHeight: 20,
  },
  nextBtn: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 10,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
