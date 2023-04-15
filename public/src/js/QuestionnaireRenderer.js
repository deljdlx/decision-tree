class Questionnaire {
  constructor(data, container) {
    this.data = data;
    this.container = container;
    this.currentQuestion = null;
  }

  render() {
    this.currentQuestion = this.data;
    this.renderQuestion();
  }

  renderQuestion() {
    const questionElement = document.createElement("div");
    const questionCaption = document.createElement("h2");
    questionCaption.innerText = this.currentQuestion.caption;
    questionElement.appendChild(questionCaption);

    const optionsElement = document.createElement("div");
    for (let key in this.currentQuestion.options) {
      const option = this.currentQuestion.options[key];
      const optionButton = document.createElement("button");
      optionButton.classList.add('questionnaire-option');
      optionButton.innerText = option.caption;
      optionButton.addEventListener("click", () => {
        if (option.type === "node") {
          this.currentQuestion = option.child;
          this.renderQuestion();
        } else {
          option.value = option.value === null ? 1 : 0;
          if (option.child !== null) {
            this.currentQuestion = option.child;
            this.renderQuestion();
          } else {
            this.onSubmit();
          }
        }
      });
      optionsElement.appendChild(optionButton);
    }

    questionElement.appendChild(optionsElement);
    this.container.innerHTML = "";
    this.container.appendChild(questionElement);
  }

  onSubmit() {
    // Code à exécuter lorsque le questionnaire est soumis
  }
}