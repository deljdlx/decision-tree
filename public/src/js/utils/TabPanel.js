class TabPanel {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.container.classList.add('tab-panel-container');

    this.tabs = this.container.querySelectorAll('.tab');
    this.contents = this.container.querySelectorAll('.tab-content');

    // Add click event listener to each tab
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        this.showTab(index);
      });

      if(tab.classList.contains('active')) {
        this.showTab(index);
      }
    });

  }

  // Method to show a specific tab
  showTab(index) {
    // Remove the 'active' class from all tabs and contents
    this.tabs.forEach(tab => {
      tab.classList.remove('active');
    });
    this.contents.forEach(content => {
      content.classList.remove('active');
    });
    // Add the 'active' class to the selected tab and content
    this.tabs[index].classList.add('active');
    this.contents[index].classList.add('active');
  }
}