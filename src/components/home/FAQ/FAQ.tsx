import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How do you verify your caregivers?',
    answer:
      'Safety is our #1 priority. Every caregiver undergoes a rigorous 3-step process: National ID verification, criminal background check, and an in-person behavioral interview.',
  },
  {
    question: 'Can I interview the caregiver beforehand?',
    answer:
      'Yes! For long-term bookings, we can arrange a video call or a meet-and-greet so you can ensure they are the perfect fit for your family.',
  },
  {
    question: 'What happens if the caregiver cancels?',
    answer:
      'Cancellations are rare, but if it happens, our system immediately notifies you and our support team works to provide a replacement within 2 hours.',
  },
];
const FAQ = () => {
  return (
    <section className="py-20 container px-4 md:px-8 mx-auto max-w-4xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border-b border-gray-100"
          >
            <AccordionTrigger className="text-lg font-medium text-gray-800 hover:text-primary hover:no-underline py-6">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 text-base pb-6 leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQ;
