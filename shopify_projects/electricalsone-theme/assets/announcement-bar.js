class announmentBar extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", this.onRemoveAnnouncement);
  }
  onRemoveAnnouncement(event) {
    let evtTargetElement = event.target;
    if (evtTargetElement.classList.contains("close__announcement--bar")) {
          evtTargetElement.parentElement.parentElement.remove();
     }
  };

}
customElements.define("announcement-bar", announmentBar);