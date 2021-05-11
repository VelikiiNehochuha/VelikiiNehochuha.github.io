<!--
.. title: SICP Потоки
.. slug: sicp-potoki
.. date: 2021-05-07 17:45:06 UTC+03:00
.. tags: sicp, scheme, lisp
.. category: 
.. link: 
.. description: 
.. type: text
-->

### Упражнение 3.50
Закончите следующее определение, которое обращает процедуру stream-map, чтобы она позволяла использовать процедуры от нескольких аргументов, подобно map из раздела 2.2.1

```schema
(define (stream-map proc . argstreams)
  (if (stream-null? (car argstreams))
      the-empty-stream
      (cons-stream
       (apply proc (map stream-car argstreams))
       (apply stream-map
              (cons proc (map stream-cdr argstreams))))))
```

### Упражнение 3.51
Чтобы внимательнее изучить задержанные вычисления, мы воспользуемся следующей процедурой, которая печатает свой аргумент, а затем возвращает его:

```schema
(define (show x)
  (display-line x)
  x)
```

Что печатает интерпретатор в ответ на каждое выражение из следующей последовательности?

```schema
(define x (stream-map show (stream-enumerate-interval 0 10)))
;; 0
;; 2
;; ...
;; 10
(stream-ref x 5)
;; 5
(stream-ref x 7)
;; 7
```

### Упражнение 3.52
Рассмотрим последовательность выражений
```schema
(define sum 0)

(define (accum x)
  (set! sum (+ x sum))
  sum)

(define seq (stream-map accum (stream-enumerate-interval 1 20)))
seq
(define y (stream-filter even? seq))
y
(define z (stream-filter (lambda (x) (= (remainder x 5) 0))
                         seq))
z
(stream-ref y 7)
(display-stream z)
```

Изменился бы этот результат, если бы мы реализовали (delay выражение) просто как (lambda () выражение), не применяя оптимизацию через memo-proc? Объясните свой ответ.

Ответ бы не изменился, но при вызове display-stream элементы последовательности вычислялись бы повторно, что сказывается на производительности.

### Упражнение 3.53

Не запуская программу, опишите элементы потока, порождаемого

```schema
(define (add-streams s1 s2)
  (stream-map + s1 s2))
(define s (cons-stream 1 (add-streams s s)))
```

1 2 4 8 16, ...


### Упражнение 3.54

Определите процедуру mul-streams, аналогичную add-streams, которая порождает поэлементное произведение двух входных потоков. С помощью нее и потока integers закончите следующее определение потока, n-й элемент которого (начиная с 0) равен факториалу n + 1:

```schema
(define (mul-streams s1 s2)
  (stream-map * s1 s2))
(define factorials (cons-stream 1 (mul-streams integers factorials)))
```

### Упражнение 3.55.
Определите процедуру partial-sums, которая в качестве аргумента берет поток S, а возвращает поток, элементы которого равны S0, S0 + S1, S0 + S1 + S2, . . .. Например, (partial-sums integers) должно давать поток 1, 3, 6, 10, 15

```schema
(define (partial-sums stream)
  (define (iter ps prev)
    (cons-stream (+ (stream-car ps) prev) (iter (stream-cdr ps) (+ (stream-car ps) prev))))
  (iter stream 0))

(stream-ref (partial-sums integers) 0) ;; 1
(stream-ref (partial-sums integers) 1) ;; 3
(stream-ref (partial-sums integers) 2) ;; 6
(stream-ref (partial-sums integers) 3) ;; 10
(stream-ref (partial-sums integers) 4) ;; 15

;; more nicely solution
(define (partial-sums s)
   (add-streams s (cons-stream 0 (partial-sums s))))

(stream-ref (partial-sums integers) 0) ;; 1
(stream-ref (partial-sums integers) 1) ;; 3
(stream-ref (partial-sums integers) 2) ;; 6
(stream-ref (partial-sums integers) 3) ;; 10
(stream-ref (partial-sums integers) 4) ;; 15
```

### Упражнения 3.56.
