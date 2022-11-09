import React from 'react';
import { Accordion, AccordionCollapse, AccordionToggle, Form } from 'react-bootstrap';
import useGetCancellationText, { CancellationTextType } from '../../misc/useGetCancellationText';

const LandingCancellationText = (props: any) => {
  const cancellationText = useGetCancellationText(CancellationTextType.LANDING);
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <>
      {cancellationText && cancellationText[0] && (
        <Accordion className='mb-5 mx-auto' onSelect={(evt) => setCollapsed(evt !== null)}>
          <AccordionToggle as={Form.Label} className='w-100' eventKey='0'>
            <p
              dangerouslySetInnerHTML={{
                __html: `${cancellationText[0]} ${!collapsed ? '(...)' : ''}`,
              }}
              className='cancellation-text'
            ></p>
          </AccordionToggle>

          <AccordionCollapse eventKey='0'>
            <p dangerouslySetInnerHTML={{ __html: cancellationText[1] }} className='cancellation-text ' />
          </AccordionCollapse>
        </Accordion>
      )}
    </>
  );
};

export default LandingCancellationText;
