<template>
  <main class="container">
    <header class="header"><h1>TaskTimer</h1></header>
    <div class="toolbar">
      <button class="btn" @click="loadTasks">Afficher les taches</button>
    </div>
    <section class="card">
      <h2>Nouvelle tâche</h2>
      <div class="form-row">
        <input v-model="form.title" placeholder="Titre…" />
        <select v-model="form.priority">
          <option value="low">Faible</option>
          <option value="medium">Moyenne</option>
          <option value="high">Élévée</option>
        </select>
      </div>
      <div class="form-row">
        <textarea
          v-model="form.description"
          placeholder="Description…"
          rows="2"
          style="width: 100%"
        ></textarea>
      </div>
      <button class="btn" @click="createTask">+ Ajouter une tâche</button>
    </section>
    <div v-if="error" id="errors">Erreuur : {{ error }}</div>
    <section class="list">
      <h2>Tâches</h2>
      <ul v-if="tasks.length">
        <li v-for="t in tasks" :key="t.id" class="item">
          <template v-if="editId === t.id">
            <div class="form-row">
              <input v-model="edit.title" />
              <select v-model="edit.priority">
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élévée</option>
              </select>
            </div>
            <div class="form-row">
              <textarea
                v-model="edit.description"
                rows="2"
                style="width: 100%"
              ></textarea>
            </div>
            <div class="actions">
              <button class="btn" @click="saveEdit(t)">Enregistrer</button>
              <button class="btn-secondary" @click="cancelEdit">Annuler</button>
            </div>
          </template>
          <template v-else>
            <div>
              <span class="title"
                >{{ t.title }}
                <small>[{{ priorityLabel(t.priority) }}]</small></span
              >
              <p v-if="t.description" class="desc">{{ t.description }}</p>
            </div>
            <div class="actions">
              <button class="btn-secondary" @click="startEdit(t)">
                Modifier
              </button>
              <button class="btn-danger" @click="deleteTask(t)">
                Supprimer
              </button>
            </div>
          </template>
        </li>
      </ul>
      <p v-else class="empty">Aucune tâche pour le moment.</p>
    </section>
  </main>
</template>
<script setup>
import { ref } from "vue";
const API = "/api/tasks";
const tasks = ref([]);
const error = ref("");
const form = ref({ title: "", priority: "medium", description: "" });
const editId = ref(null);
const edit = ref({ title: "", priority: "medium", description: "" });
const PRIORITY_LABELS = { low: "Faible", medium: "Moyenne", high: "Élevée" };
function priorityLabel(v) {
  return PRIORITY_LABELS[v] || v;
}
async function loadTasks() {
  error.value = "";
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error("Chargement impossible");
    tasks.value = await res.json();
  } catch (e) {
    error.value = e.message;
  }
}
async function createTask() {
  error.value = "";
  if (!form.value.title.trim()) {
    error.value = "Le titre est obligatoire";
    return;
  }

  // BUG (intentionnel) : ajout optimiste dans la liste avant la réponse de l’API
  const optimistic = {
    id: Math.floor(Math.random() * 1_000_000_000),
    title: form.value.title.trim(),
    priority: form.value.priority,
    description: form.value.description?.trim() || "",
  };
  tasks.value = [optimistic, ...tasks.value];

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.value.title.trim(),
        priority: form.value.priority,
        description: form.value.description?.trim() || "",
      }),
    });
    if (res.status !== 201) throw new Error("Création impossible");
    const created = await res.json();
    // BUG (intentionnel) : on ajoute la vraie tâche sans retirer la version optimiste
    tasks.value = [created, ...tasks.value];
    form.value = { title: "", priority: "medium", description: "" };
  } catch (e) {
    error.value = e.message;
  }
}

function startEdit(t) {
  editId.value = t.id;
  edit.value = {
    title: t.title,
    priority: t.priority,
    description: t.description || "",
  };
}
function cancelEdit() {
  editId.value = null;
  edit.value = { title: "", priority: "medium", description: "" };
}
async function saveEdit(t) {
  error.value = "";
  try {
    const res = await fetch(`${API}/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: edit.value.title,
        priority: PRIORITY_LABELS[edit.value.priority] || edit.value.priority, // BUG (intentionnel) : valeur envoyée incorrecte
        description: edit.value.description,
      }),
    });
    if (!res.ok) throw new Error("Mise à jour impossible");
    const updated = await res.json();
    tasks.value = tasks.value.map((x) => (x.id === updated.id ? updated : x));
    editId.value = null;
  } catch (e) {
    error.value = e.message;
  }
}
async function deleteTask(t) {
  error.value = "";
  try {
    const res = await fetch(`${API}/${t.id}`, { method: "DELETE" });
    if (res.status !== 204) throw new Error("Suppression impossible");
    tasks.value = tasks.value.filter((x) => x.id !== t.id);
  } catch (e) {
    error.value = e.message;
  }
}
</script>
