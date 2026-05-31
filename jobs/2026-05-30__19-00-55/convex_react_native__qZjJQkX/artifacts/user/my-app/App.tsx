import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  SafeAreaView,
} from "react-native";
import { ConvexProvider, ConvexReactClient, useQuery, useMutation } from "convex/react";
import { api } from "./convex/_generated/api";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL!;
const runId = process.env.EXPO_PUBLIC_RUN_ID!;

const convex = new ConvexReactClient(convexUrl);

function TaskList() {
  const tasks = useQuery(api.tasks.list, { runId }) || [];
  const addTask = useMutation(api.tasks.add);
  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = async () => {
    if (newTaskText.trim()) {
      await addTask({ text: newTaskText, runId });
      setNewTaskText("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTaskText}
          onChangeText={setNewTaskText}
          placeholder="New Task"
          testID="task-input"
        />
        <Pressable
          style={styles.button}
          onPress={handleAddTask}
          testID="add-button"
        >
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.taskItem} testID="task-item">
            <Text>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

export default function App() {
  if (!convexUrl || !runId) {
    return (
      <View style={styles.container}>
        <Text>Missing environment variables EXPO_PUBLIC_CONVEX_URL or EXPO_PUBLIC_RUN_ID</Text>
      </View>
    );
  }

  return (
    <ConvexProvider client={convex}>
      <SafeAreaView style={{ flex: 1 }}>
        <TaskList />
      </SafeAreaView>
    </ConvexProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 40,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  taskItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
