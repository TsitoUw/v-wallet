import useMoneyStore from "../../store/moneyStore.js";
import useConsoStore from "../../store/consoStore.js";
import { storageGet } from "../../utils/localStorage.js";
import Consomation from "./consomation.js";
import { ref, watch } from "../../utils/reactivity.js";
import ChangeCurrendBalanceModal from "./changeCurrentBalanceModal.js";

export default function Home() {
  const formater = Intl.NumberFormat("fr");
  const moneyStore = useMoneyStore();
  const consoStore = useConsoStore();

  const moneyStorage = storageGet("money");
  const consoStorage = storageGet("conso");

  if (moneyStorage) moneyStore.setMoney(moneyStorage);
  if (consoStorage) consoStore.setConso(consoStorage);

  const showModal = ref(false);

  moneyStore.setTodays();

  function script() {
    const actualElt = document.getElementById("actual");
    const todaysElt = document.getElementById("todays");
    const consosElt = document.getElementById("consoselt");
    const cardCurrentElt = document.getElementById("cardCurrent");

    const money = moneyStore.money;

    cardCurrentElt.addEventListener("click", () => {
      showModal.value = !showModal.value;
    });

    const renderOverview = () => {
      actualElt.innerHTML = formater.format(money.value.actual);
      todaysElt.innerHTML = formater.format(money.value.todays);
    }
    renderOverview();
    // consosElt.innerHTML = consos;

    consoStore.consos.value
      ? consoStore.consos.value.map((conso) => {
          Consomation(conso).script(conso);
        })
      : null;

    const renderConsomations = () => {
      consosElt.innerHTML = consoStore.consos.value.map((conso) => Consomation(conso).render()).join("");
    };
    watch(consoStore.consos, renderConsomations);
    watch(showModal, () => {
      ChangeCurrendBalanceModal().script(showModal);
    });
    watch(moneyStore.money, renderOverview)

    addEventListener("close", (e) => {
      showModal.value = e.detail.showModal;
    });
    addEventListener("editActual", (e) => {
      console.log(e.detail);
      moneyStore.setActual(e.detail.actual);
    });
  }

  const render = () =>
    /*html*/
    `
  <div id="content" class="bg-gray h-content p-2 flex flex-col">
    <div class="my-1 uppercase">Overview</div>
    <div class="overview | flex w-full">
      <div class="card w-1/2 " id="cardCurrent">
        <div class="title">Current balance</div>
        <div class="content">
            <h1 class="text-xlarge font-bolder text-right"><span id="actual">0</span>Ar</h1>
          </div>
      </div>
      <div class="card w-1/2">
        <div class="title">Today's consomation</div>
        <div class="content">
          <h1 class="text-xlarge font-bolder text-right"><span id="todays">0</span>Ar</h1>
        </div>
      </div>
    </div>
    <div class="my-1 uppercase">Consomations</div>
    <div id="consoselt" class="category flex flex-col">${
      consoStore.consos.value ? consoStore.consos.value.map((conso) => Consomation(conso).render()).join("") : ""
    }</div>
  </div>
  `;

  return {
    render,
    script,
  };
}
