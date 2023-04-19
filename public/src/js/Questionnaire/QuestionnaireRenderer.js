class QuestionnaireRenderer {

  tree;
  choosedOptions = {}
  session = null;

  constructor(tree, selector) {
    this.tree = tree;
    this.container = document.querySelector(selector);
    this.session = new QuestionnaireSession(this.tree);
    this.currentQuestion = null;
  }

  render() {
    this.currentQuestion = this.tree;
    this.renderQuestion();
  }

  refresh() {
    this.container.innerHTML = '';
    this.render();
  }

  renderQuestion() {
    const questionElement = document.createElement("div");
    const questionCaption = document.createElement("h2");
    questionCaption.innerText = this.currentQuestion.getCaption();
    questionElement.appendChild(questionCaption);

    const optionsElement = document.createElement("div");

    for (let key in this.currentQuestion.getOptions()) {
      const option = this.currentQuestion.getOption(key);
      const optionButton = document.createElement("button");
      optionButton.classList.add('questionnaire-option');
      optionButton.innerText = option.getCaption();

      optionButton.addEventListener("click", () => {
        this.handleOptionSelection(option);
      });

      optionsElement.appendChild(optionButton);
    }

    questionElement.appendChild(optionsElement);
    this.container.innerHTML = "";
    this.container.appendChild(questionElement);
  }

  handleOptionSelection(option) {

    if (option.type === "node") {
      this.currentQuestion = option.getChildNode();
      this.renderQuestion();
    } else {

      this.session.addChoice(option);

      if (option.getChildNode() !== null) {
        this.currentQuestion = option.getChildNode();
        this.renderQuestion();
      } else {
        this.onSubmit();
      }
    }
  }

  onSubmit() {
    // Code à exécuter lorsque le questionnaire est soumis
  }
}