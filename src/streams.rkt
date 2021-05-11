;; Stream
(define (stream-car stream) (car stream)
(define (stream-cdr stream) (force (cdr stream)))
(define (stream-null? stream)
  (null? (stream-car stream)))


(define (delay expression)
  (lambda () (expression)))

(define (force delayed-object) (delayed-object))

(define (stream-for-each proc s)
  (if (stream-null? s)
    ’done
    (begin (proc (stream-car s))
           (stream-for-each proc (stream-cdr s)))))

(define (stream-ref s n)
  (if (= n 0)
    (stream-car s)
    (stream-ref (stream-cdr s) (- n 1))))


(define (stream-map proc . argstreams)
  (if (stream-null? (car argstreams))
    the-empty-stream
    (cons-stream
      (apply proc (map stream-car argstreams))
      (apply stream-map
        (cons proc (map stream-cdr argstreams))))))

;; 3.51

(define (show x) (display-line x) x)

(define x (stream-map show (stream-enumerate-interval 0 10)))