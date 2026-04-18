import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LEVEL_COLORS } from '../data/workouts';

export default function WorkoutScreen({ route, navigation }) {
  const { workout } = route.params;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={[styles.hero, { backgroundColor: workout.color }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.heroEmoji}>{workout.emoji}</Text>
          <Text style={styles.heroTitle}>{workout.title}</Text>
          <Text style={styles.heroDesc}>{workout.description}</Text>

          <View style={styles.heroBadges}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>⏱ {workout.duration} min</Text>
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>🔥 {workout.calories} cal</Text>
            </View>
            <View style={[styles.heroBadge, { backgroundColor: LEVEL_COLORS[workout.level] + 'aa' }]}>
              <Text style={styles.heroBadgeText}>{workout.level}</Text>
            </View>
          </View>
        </View>

        {/* Start Button */}
        <View style={styles.startContainer}>
          <TouchableOpacity
            style={[styles.startBtn, { backgroundColor: workout.color }]}
            onPress={() => navigation.navigate('Exercise', { workout, exerciseIndex: 0 })}
            activeOpacity={0.85}
          >
            <Text style={styles.startBtnText}>Start Workout 🚀</Text>
          </TouchableOpacity>
        </View>

        {/* Exercise List */}
        <Text style={styles.sectionTitle}>Exercises ({workout.exercises.length})</Text>
        {workout.exercises.map((exercise, index) => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.exerciseRow}
            onPress={() => navigation.navigate('Exercise', { workout, exerciseIndex: index })}
            activeOpacity={0.8}
          >
            <View style={[styles.indexCircle, { backgroundColor: workout.color }]}>
              <Text style={styles.indexText}>{index + 1}</Text>
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.emoji} {exercise.name}</Text>
              <Text style={styles.exerciseMeta}>
                {exercise.sets} sets ·{' '}
                {exercise.reps ? `${exercise.reps} reps` : `${exercise.duration}s`}
                {' · '}{exercise.rest}s rest
              </Text>
              <Text style={styles.exerciseMuscles}>{exercise.muscles}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.footer} />
      </ScrollView>
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
  },
  hero: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  backBtn: {
    marginBottom: 16,
  },
  backText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 16,
    fontWeight: '600',
  },
  heroEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: 16,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  heroBadge: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  startContainer: {
    padding: 20,
  },
  startBtn: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    padding: 14,
  },
  indexCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  indexText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  exerciseMeta: {
    fontSize: 12,
    color: '#64ffda',
    marginBottom: 2,
  },
  exerciseMuscles: {
    fontSize: 11,
    color: '#8892b0',
  },
  chevron: {
    color: '#8892b0',
    fontSize: 22,
    fontWeight: '300',
  },
  footer: {
    height: 30,
  },
});
