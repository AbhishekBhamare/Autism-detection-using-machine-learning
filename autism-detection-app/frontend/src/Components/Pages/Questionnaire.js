import React, { useState } from "react";
import Sidebar from "./Sidebar";

const Questionnaire = () => {
  const [answers, setAnswers] = useState(Array(21).fill("")); // Array to store user input for questions
  const [prediction, setPrediction] = useState(null); // State for storing the prediction result
  const [loading, setLoading] = useState(false); // State to show loading spinner during submission

  const questions = [
    "I often notice small sounds when others do not.",
    "When I’m reading a story, I find it difficult to work out the characters’ intentions.",
    "I find it easy to 'read between the lines' when someone is talking to me.",
    "I usually concentrate more on the whole picture, rather than the small details.",
    "I know how to tell if someone listening to me is getting bored.",
    "I find it easy to do more than one thing at once.",
    "I find it easy to work out what someone is thinking or feeling just by looking at their face.",
    "If there is an interruption, I can switch back to what I was doing very quickly.",
    "I like to collect information about categories of things.",
    "I find it difficult to work out people’s intentions.",
  ];

  const additionalQuestions = [
    { text: "Age in years", type: "number" },
    {
      text: "Gender",
      type: "radio",
      options: [
        { label: "Male", value: 1 },
        { label: "Female", value: 0 },
      ],
    },
    {
      text: "Ethnicity",
      type: "dropdown",
      options: [
        "White-European",
        "Latino",
        "Black",
        "Asian",
        "Middle Eastern",
        "Pasifika",
        "South Asian",
        "Hispanic",
        "Turkish",
        "Others",
      ],
    },
    { text: "Born with Jundice (Yes, No)", type: "radio" },
    { text: "Whether any immediate family member has a ASD (Yes, No)", type: "radio" },
    {
      text: "Continent of residence",
      type: "dropdown",
      options: [
        "Africa",
        "Asia",
        "Europe",
        "North America",
        "Oceania",
        "South America",
      ],
    },
    { text: "Whether the user has used the screening app before (Yes, No)", type: "radio" },
    {
      text: "Who is completing the test",
      type: "dropdown",
      options: ["Self", "Parent", "Health care professional", "Relative", "Others"],
    },
    { text: "Age description (18 and more)", type: "radio" },
  ];

  const allQuestions = [
    ...questions.map((q) => ({ text: q, type: "radio" })),
    ...additionalQuestions,
  ];

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const encodedArray = [];

    // Encode A1 to A10 (Yes → 1, No → 0)
    for (let i = 0; i < 10; i++) {
      encodedArray.push(answers[i] === "Yes" ? 1 : 0);
    }

    // Encode Age
    encodedArray.push(Number(answers[10]));

    // Encode Gender (Male → 0, Female → 1)
    encodedArray.push(Number(answers[11]));

    // Encode Jundice, Autism, Used App Before (Yes → 1, No → 0)
    encodedArray.push(answers[13] === "Yes" ? 1 : 0);
    encodedArray.push(answers[14] === "Yes" ? 1 : 0);
    encodedArray.push(answers[16] === "Yes" ? 1 : 0);

    // Encode Age Description (18+ → 1, otherwise 0)
    encodedArray.push(Number(answers[17]) >= 18 ? 1 : 0);

    // Ethnicity One-Hot Encoding
    const ethnicityOptions = [
      "Asian",
      "Black",
      "Hispanic",
      "Latino",
      "Middle Eastern",
      "Others",
      "Pasifika",
      "South Asian",
      "Turkish",
      "White-European",
    ];
    ethnicityOptions.forEach((option) =>
      encodedArray.push(answers[12] === option ? 1 : 0)
    );

    // Relation One-Hot Encoding
    const relationOptions = [
      "Health care professional",
      "Others",
      "Parent",
      "Relative",
      "Self",
    ];
    relationOptions.forEach((option) =>
      encodedArray.push(answers[18] === option ? 1 : 0)
    );

    // Continent One-Hot Encoding
    const continentOptions = [
      "Africa",
      "Asia",
      "Europe",
      "North America",
      "Oceania",
      "South America",
    ];
    continentOptions.forEach((option) =>
      encodedArray.push(answers[15] === option ? 1 : 0)
    );

    try {
      const response = await fetch("http://127.0.0.1:5432/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ arr: encodedArray }),
      });

      if (!response.ok) throw new Error("Failed to get prediction");

      const result = await response.json();
      setPrediction(result.prediction == 1 ? "Autism" : "No Autism");
    } catch (error) {
      console.error(error);
      setPrediction("Error occurred during submission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 h-screen p-8 ml-64 space-y-8 overflow-y-auto bg-gray-50">
        <h1 className="text-3xl font-semibold text-center text-gray-800">Autism Questionnaire</h1>
        <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {allQuestions.map((question, index) => (
              <div
                key={index}
                className="flex flex-col items-start p-4 transition-shadow border border-gray-200 rounded-lg hover:shadow-md"
              >
                <label className="mb-4 text-lg font-medium text-gray-700">{`${index + 1}. ${question.text}`}</label>
                <div className="flex flex-col w-full space-y-4">
                  {question.type === "radio" ? (
                    question.options ? (
                      question.options.map((option, optIndex) => (
                        <label key={optIndex} className="flex items-center space-x-2 text-gray-600">
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option.value}
                            checked={answers[index] === option.value}
                            onChange={() => handleAnswerChange(index, option.value)}
                            className="text-blue-500 form-radio focus:ring focus:ring-blue-300"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))
                    ) : (
                      ["Yes", "No"].map((option, optIndex) => (
                        <label key={optIndex} className="flex items-center space-x-2 text-gray-600">
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            checked={answers[index] === option}
                            onChange={() => handleAnswerChange(index, option)}
                            className="text-blue-500 form-radio focus:ring focus:ring-blue-300"
                          />
                          <span>{option}</span>
                        </label>
                      ))
                    )
                  ) : question.type === "dropdown" ? (
                    <select
                      value={answers[index]}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    >
                      <option value="">Select...</option>
                      {question.options.map((option, optIndex) => (
                        <option key={optIndex} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={question.type === "number" ? "number" : "text"}
                      value={answers[index]}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                      placeholder={`Enter ${question.type === "number" ? "a number" : "text"}`}
                    />
                  )}
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Result Display */}
        {prediction && (
          <div className="max-w-4xl p-6 mx-auto bg-blue-100 border-l-4 border-blue-500 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-700">Prediction Result</h2>
            <p className="mt-4 text-lg text-blue-600">
              {prediction === "Autism"
                ? "The result suggests Autism."
                : "The result suggests No Autism."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
