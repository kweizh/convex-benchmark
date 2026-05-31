import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, FlatList } from "react-native";
import { ConvexReactClient, ConvexProvider, useQuery, useMutation } from "convex/react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

function TaskApp() {
  const runId = process.env.EXPO_PUBLIC_RUN_ID || "";
  const tasks = useQuery("tasks:getByRunId", { runId });
  const addTask = useMutation("tasks:addTask");
  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = () => {
    if (newTaskText.trim() === "") return;
    addTask({ text: newTaskText.trim(), runId });
    setNewTaskText("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task List</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={newTaskText}
          onChangeText={setNewTaskText}
          placeholder="Enter a task..."
          testID="task-input"
        />
        <Button title="Add" onPress={handleAddTask} testID="add-button" />
      </View>
      {tasks === undefined ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.taskItem} testID="task-item">
              <Text>{item.text}</Text>
            </View>
          )}
        />
      )}
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
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  taskItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});