'use client';

import { Status } from '@prisma/client';
import { Select } from '@radix-ui/themes'
import React from 'react';

const statuses: { label: string, value?: Status }[] = [
    {label: 'Open', value: 'OPEN'}, 
    {label: 'In Progress', value: 'IN_PROGRESS'}, 
    {label: 'Closed', value: 'CLOSED'}, 
]

const IssueStatusFilter = () => {

    //console.log('IssueStatusFilter is rendering.')
  return (
    <Select.Root>
        <Select.Trigger placeholder='Filter by status...' />
        <Select.Content>
            <Select.Item key="unassigned" value="unassigned">
                All
            </Select.Item>
            { statuses.map( status => (
                <Select.Item key={status.value} value={status.value || 'unknown'}>
                    {status.label}
                </Select.Item>))}
        </Select.Content>
    </Select.Root>
  )
}

export default IssueStatusFilter