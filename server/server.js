const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Candidature = require("./models/Candidature");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données MongoDB (assurez-vous de remplacer l'URL par la vôtre)
mongoose.connect(
  "mongodb+srv://mathiasfernandes:V9CF6ufllz8Fveor@mescandidatures.6frwrkh.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on(
  "error",
  console.error.bind(console, "Erreur de connexion à la base de données :")
);
db.once("open", () => {
  console.log("Connecté à la base de données MongoDB");
});

app.post("/api/candidatures", async (req, res) => {
  try {
    // Récupérez les données du formulaire depuis la requête
    const {
      nomEntreprise,
      coordonnees,
      provenanceAnnonce,
      technos,
      reponseEntretienRefus,
      lieu,
      intitulePoste,
      descriptionPoste,
      dateCandidature,
      dateRefus,
      dateRelance,
    } = req.body;

    // Créez une nouvelle instance du modèle Candidature avec les données du formulaire
    const nouvelleCandidature = new Candidature({
      nomEntreprise,
      coordonnees,
      provenanceAnnonce,
      technos,
      reponseEntretienRefus,
      lieu,
      intitulePoste,
      descriptionPoste,
      dateCandidature,
      dateRefus,
      dateRelance,
    });

    // Enregistrez la candidature dans la base de données
    await nouvelleCandidature.save();

    // Répondez avec un code de succès
    res.status(201).json({ message: "Candidature créée avec succès" });
  } catch (error) {
    console.error(error);
    // Répondez avec un code d'erreur en cas d'échec
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la candidature" });
  }
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${port}`);
});
