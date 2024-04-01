const expenses = [];
const expenseForm = document.forms['expense-form']; // Accessing the form by name
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expensesList = document.getElementById('expenses-list');
const budgetAmountSpan = document.getElementById('budget-amount');
const remainingBudgetSpan = document.getElementById('remaining-budget');
const expenseChartCanvas = document.getElementById('expenseChart').getContext('2d');
const budgetAmountInput = document.getElementById('budget-amount-input');
const expensesKey = 'expenses';
const budgetKey = 'budget';






function updateBarChart() {
    const expenseLabels = expenses.map(expense => expense.name);
    const expenseAmounts = expenses.map(expense => expense.amount);

    if (barChart) {
        barChart.data.labels = expenseLabels;
        barChart.data.datasets[0].data = expenseAmounts;
        barChart.update();
    } else {
        barChart = new Chart(barChartCanvas, {
            type: 'bar',
            data: {
                labels: expenseLabels,
                datasets: [{
                    label: 'Expense',
                    data: expenseAmounts,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

budgetAmountInput.addEventListener('input', function() {
    updateBudget();
});



// Load expenses and budget from localStorage when the page is loaded
window.addEventListener('DOMContentLoaded', function() {
    // Load expenses
    const storedExpenses = localStorage.getItem(expensesKey);
    if (storedExpenses) {
        expenses.push(...JSON.parse(storedExpenses));
        renderExpenses();
        updateBudget();
        updateChart();
    }

    // Load budget
    const storedBudget = localStorage.getItem(budgetKey);
    if (storedBudget) {
        budgetAmountInput.value = storedBudget;
        updateBudget();
    }
});

budgetAmountInput.addEventListener('input', function() {
    updateBudget();
});

function updateBudget() {
    const newBudgetAmount = parseFloat(budgetAmountInput.value);

    if (isNaN(newBudgetAmount) || newBudgetAmount <= 0) {
        alert('Please enter a valid budget amount.');
        return;
    }

    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const remainingBudget = newBudgetAmount - totalExpenses;

    budgetAmountSpan.textContent = newBudgetAmount.toFixed(2);
    remainingBudgetSpan.textContent = remainingBudget.toFixed(2);

// Update chart if it has been initialized
    if (myChart) {
        myChart.data.datasets[0].data[0] = newBudgetAmount;
        myChart.update();
    }

    // Save budget to localStorage
    localStorage.setItem(budgetKey, newBudgetAmount);
}

let myChart = null; // Initialize myChart to null

expenseForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const expenseName = expenseNameInput.value;
    const expenseAmount = parseFloat(expenseAmountInput.value);

    if (!expenseName || isNaN(expenseAmount) || expenseAmount <= 0) {
        alert('Please enter a valid expense name and amount.');
        return;
    }

    const expense = {
        name: expenseName,
        amount: expenseAmount,
        date: new Date().toLocaleDateString() // Add the current date as the expense date
    };

   expenses.push(expense);
    renderExpenses();
    updateChart();
    expenseNameInput.value = '';
    expenseAmountInput.value = '';

    // Save expenses to localStorage
    localStorage.setItem(expensesKey, JSON.stringify(expenses));
});

function renderExpenses() {
    expensesList.innerHTML = '';
    expenses.forEach(function (expense, index) {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${expense.name}: $${expense.amount.toFixed(2)} - ${expense.date}`;
        expensesList.appendChild(li);
    });
}

// Function to clear expenses
function clearExpenses() {
    // Clear the expenses array
    expenses.length = 0;
    // Render the cleared expenses list
    renderExpenses();
    // Update the budget and chart
    updateBudget();
    updateChart();
    // Remove expenses and budget from localStorage
    localStorage.removeItem(expensesKey);
}

function updateChart() {
    const expenseLabels = expenses.map(expense => expense.name);
    const expenseAmounts = expenses.map(expense => expense.amount);

    if (myChart) {
        myChart.data.labels = expenseLabels;
        myChart.data.datasets[0].data = expenseAmounts;
        myChart.update();
    } else {
        myChart = new Chart(expenseChartCanvas, {
            type: 'pie',
            data: {
                labels: expenseLabels,
                datasets: [{
                    label: 'Expense',
                    data: expenseAmounts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            }
        });
    }
    
}
