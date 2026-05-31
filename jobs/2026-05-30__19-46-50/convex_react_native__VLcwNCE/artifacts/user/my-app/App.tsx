import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ConvexProvider, ConvexReactClient, useMutation, useQuery } from "convex/react";
import { api } from "./convex/_generated/api";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL ?? "";
const runId = process.env.EXPO_PUBLIC_RUN_ID ?? "local";

function TaskList() {
  const [text, setText] = useState("");
  const tasks = useQuery(api.tasks.listByRunId, { runId }) ?? [];
  const addTask = useMutation(api.tasks.addTask);

  const handleAdd = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    await addTask({ text: trimmed, runId });
    setText("");
  };

  return (
    <View style={styles.content}>
      <Text style={styles.title}>Tasks</Text>
      <View style={styles.inputRow}>
        <TextInput
          testID="task-input"
          placeholder="Add a task"
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <Button title="Add" onPress={handleAdd} testID="add-button" />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(task) => task._id}
        renderItem={({ item }) => (
          <View style={styles.taskItem} testID="task-item">
            <Text>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet.</Text>}
      />
    </View>
  );
}

export default function App() {
  const client = useMemo(() => new ConvexReactClient(convexUrl), [convexUrl]);

  if (!convexUrl) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Missing EXPO_PUBLIC_CONVEX_URL.</Text>
      </SafeAreaView>
    );
  }

  return (
    <ConvexProvider client={client}>
      <SafeAreaView style={styles.container}>
        <TaskList />
        <StatusBar style="auto" />
      </SafeAreaView>
    </ConvexProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  taskItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginBottom: 8,
  },
  empty: {
    color: "#666",
  },
  error: {
    padding: 16,
    color: "#b00020",
  },
});
