import { ConvexProvider, ConvexReactClient } from "convex/react";
import { StyleSheet, Text, View, TextInput, Button, FlatList } from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "./convex/_generated/api";
import { useState } from "react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL as string);
const runId = process.env.EXPO_PUBLIC_RUN_ID as string || "default_run_id";

function TaskApp() {
  const tasks = useQuery(api.tasks.get, { runId }) || [];
  const addTask = useMutation(api.tasks.add);
  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask({ text: newTaskText, runId });
      setNewTaskText("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Text style={styles.task} testID="task-item">
            {item.text}
          </Text>
        )}
      />
      <TextInput
        style={styles.input}
        value={newTaskText}
        onChangeText={setNewTaskText}
        placeholder="New task..."
        testID="task-input"
      />
      <Button title="Add Task" onPress={handleAddTask} testID="add-button" />
    </View>
  );
}

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <TaskApp />
    </ConvexProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  task: {
    fontSize: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
