package com.example.householdbudget

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin(origins = ["*"])
class HelloController {

    @GetMapping("/api/hello")
    fun sayHello(): Map<String, String> {
        return mapOf("message" to "Hello from Kotlin Backend!")
    }
}
