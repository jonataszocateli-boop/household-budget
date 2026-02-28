package com.example.householdbudget

import java.util.UUID

enum class TransactionType {
    INCOME,
    EXPENSE
}

data class Transaction(
    val id: String = UUID.randomUUID().toString(),
    val description: String,
    val amount: Double,
    val type: TransactionType,
    val yearMonth: String // Format: YYYY-MM
)

data class BudgetSummary(
    val yearMonth: String,
    val incomes: List<Transaction>,
    val expenses: List<Transaction>,
    val totalIncome: Double,
    val totalExpense: Double,
    val netAmount: Double
)

data class CreateTransactionRequest(
    val description: String,
    val amount: Double,
    val type: TransactionType
)
