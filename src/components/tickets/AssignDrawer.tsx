import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, User } from 'lucide-react';
import { User as UserType } from '../../types';

interface AssignDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (staffId: string) => void;
  staff: UserType[];
  currentAssigneeId?: string;
  isAssigning: boolean;
}

export const AssignDrawer: React.FC<AssignDrawerProps> = ({
  isOpen,
  onClose,
  onAssign,
  staff,
  currentAssigneeId,
  isAssigning,
}) => {
  const handleAssign = (staffId: string) => {
    onAssign(staffId);
    onClose();
  };

  const handleUnassign = () => {
    onAssign('');
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Assign Ticket
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex-1 px-4 py-6 sm:px-6">
                      <div className="space-y-3">
                        {/* Unassign option */}
                        <button
                          onClick={handleUnassign}
                          disabled={isAssigning}
                          className={`
                            w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors
                            ${!currentAssigneeId ? 'bg-blue-50 border-blue-200' : ''}
                            ${isAssigning ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Unassigned</p>
                              <p className="text-sm text-gray-500">Remove current assignment</p>
                            </div>
                          </div>
                        </button>

                        {/* Staff list */}
                        {staff.map((member) => (
                          <button
                            key={member.id}
                            onClick={() => handleAssign(member.id)}
                            disabled={isAssigning}
                            className={`
                              w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors
                              ${currentAssigneeId === member.id ? 'bg-blue-50 border-blue-200' : ''}
                              ${isAssigning ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {member.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{member.name}</p>
                                <p className="text-sm text-gray-500">
                                  {member.department || member.email}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};