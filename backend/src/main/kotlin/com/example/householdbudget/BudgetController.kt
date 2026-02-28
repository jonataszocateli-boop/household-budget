package com.example.householdbudget

import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/budget")
@CrossOrigin(origins = ["*"], methods = [RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.OPTIONS])
class BudgetController {

    // Simple in-memory storage for now
    private val transactions = mutableListOf<Transaction>()

    @GetMapping("/{yearMonth}")
    fun getBudgetSummary(@PathVariable yearMonth: String): BudgetSummary {
        val monthTransactions = transactions.filter { it.yearMonth == yearMonth }
        
        val incomes = monthTransactions.filter { it.type == TransactionType.INCOME }
        val expenses = monthTransactions.filter { it.type == TransactionType.EXPENSE }
        
        val totalIncome = incomes.sumOf { it.amount }
        val totalExpense = expenses.sumOf { it.amount }
        
        return BudgetSummary(
            yearMonth = yearMonth,
            incomes = incomes,
            expenses = expenses,
            totalIncome = totalIncome,
            totalExpense = totalExpense,
            netAmount = totalIncome - totalExpense
        )
    }

    @PostMapping("/{yearMonth}/transactions")
    fun addTransaction(
        @PathVariable yearMonth: String,
        @RequestBody request: CreateTransactionRequest
    ): Transaction {
        val transaction = Transaction(
            description = request.description,
            amount = request.amount,
            type = request.type,
            yearMonth = yearMonth
        )
        transactions.add(transaction)
        return transaction
    }

    @DeleteMapping("/{yearMonth}/transactions/{id}")
    fun deleteTransaction(
        @PathVariable yearMonth: String,
        @PathVariable id: String
    ) {
        transactions.removeIf { it.id == id && it.yearMonth == yearMonth }
    }
}
